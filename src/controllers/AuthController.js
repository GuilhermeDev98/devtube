const Auth = require('../models/Auth')
const jwt = require('jsonwebtoken')
const UserAuthValidator = require('../Http/Validators/Auth/Auth')

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
       
    }
    
}

function generateAccessToken(user) {
   // return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600s' }); //Produção
   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); //Desenvolvimento
}
