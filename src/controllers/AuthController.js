const Auth = require('../models/Auth')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const UserAuthValidator = require('../Http/Validators/Auth/Auth')
const { v4: uuidv4 } = require('uuid');
const Mail = require('../services/Mail')

module.exports = {
    
    async login(req, res){

        const data = req.body

        UserAuthValidator.validate({...data}).then(async function (valid) {
            try 
            {
                const modelUser = new Auth()
                const user = await modelUser.authenticate(data)
                const userId = { id: user}
                if(user!== undefined){
                    const accessToken = generateAccessToken(userId)
                    const refreshToken = jwt.sign(userId, process.env.REFRESH_TOKEN_SECRET)
                    await modelUser.login(user, refreshToken)
                    res.json({ auth: true, accessToken: accessToken, refreshToken: refreshToken })
                }else{
                    res.status(403).json({message: 'E-mail e/ou senha estão incorretos.'}) ;
                }   
            }   
            catch (error) {
                res.status(500).json({message: error.message})
            }
            
        }).catch(function (err) 
        {
            res.status(500).json({message: err.errors[0], field: err.path})
        }); 

    },
    
    async refreshToken(req, res){
        try{
            const modelUser = new Auth()
            const refreshToken = req.body.refreshToken
    
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(err, user){
                if (err) return res.sendStatus(403)
                req.user = user
            })
    
            const dataId = {id:  req.user.id, token: refreshToken}
            const result = await modelUser.refreshToken(dataId)
            if (result){
                const accessToken = generateAccessToken({ id: req.user.id })
                res.json({ accessToken: accessToken })
            }else{
                res.sendStatus(403)
            }
        }catch (error) {
           res.sendStatus(500)
        }
       
    },
    

    async logged(req, res){
        const modelUser = new Auth()
        const data = req.user
        const user = await modelUser.logged(data)
        res.json(user);
    },

    async logout(req, res){
        try{
            const modelUser = new Auth()
            const refreshToken = req.body.refreshToken
    
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(err, user){
                if (err) return res.sendStatus(403)
                req.user = user
            })
    
            const dataId = {id:  req.user.id, token: refreshToken}
            const result = await modelUser.logout(dataId)
            if (result == true){
                res.status(200).json({ auth: false, accessToken: null })
            }else{
                res.sendStatus(403)
            }
        }catch (error) {
           res.sendStatus(500)
        }
       
    },

    async forgot(req, res){
        const {email} = req.body

        try {
            const userModel = new User();
            // check if email exists
            const verifyEmail = await userModel.where({email}, ['email'])
            if(verifyEmail.length >= 1){
                generateAndSentPasswordRecovery(email)
                return res.status(200).json({message: 'Verifique seu E-Mail'})
            }else{
                return res.status(500).json({message: 'E-Mail não encontrado', field: 'email'})
            }
        } catch (error) {
            return res.status(500).json({message: error.message})
            
        }
    },
    async alterPassword(req, res){
        const {email, recovery_code, newPassword} = req.query

        try {
            const userModel = new User()
            //check if code is valid
            const checkCode = await userModel.where({email, recovery_code}, ['id'])
            if(checkCode.length >= 1){
                const encriptNewPassword = await userModel.encriptPassword(newPassword)
                await userModel.update({email}, {password: encriptNewPassword})
                return res.status(200).json({message: 'Senha alterada com sucesso'})

            }else{
                return res.status(500).json({message: 'Código Inváido'})
            }
            
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }
    
}

function generateAccessToken(user) {
   // return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600s' }); //Produção
   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); //Desenvolvimento
}

async function generateAndSentPasswordRecovery(email){
    try {
        //generate recovery code
        const code = uuidv4()
        const userModel = new User()
        //save code in db
        await userModel.update({email}, {'recovery_code': code})
        const user = await userModel.where({email}, ['fullname'])
        //sent email to user
        const mail = new Mail("DevTube <transational@devtube.io>", email,"Recuperação de Senha ", `Olá ${user.fullname}, clique <a href="http://localhost:3333/api/v1/auth/forgot?recovery_code=${code}&email=${email}" target="_blank">aqui</a> para refazer uma nova senha !`);
        await mail.send()
        return true
    } catch (error) {
        throw new Error(error.message)
    }
}