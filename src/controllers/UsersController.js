const User = require('../models/User')
const knex = require('../config/database')
const UserStoreValidator = require('../Http/Validators/User/Store')

module.exports = {

    async index(req, res){
        const user_id =  req.params.id
        const fields = ['id', 'email', 'fullname', 'birth', 'nickname', 'type', 'active','channel_id', 'created_at', 'updated_at']

        if(user_id){
            const userModel = new User()
    
            try {
                const user = await userModel.where({id : user_id}, fields)
                return res.status('200').json({data: {user: user[0]}})
            } catch (error) {
                res.status(500).json({message: 'User not found'})
            }   
        }else{
            try {
                const userModel = new User()
                const getAllUsers =  await userModel.where({}, fields)
                return res.status(200).json(getAllUsers)
            } catch (error) {
                return res.status(500).json({message: error.message})
            }
        }
    },

    async store(req, res){
        const data = req.body
        UserStoreValidator.validate({...data}).then(async function (valid) {
            try {
                const user = new User(data)
                try {
                    const userRegistered = await user.store(data)
                    if(userRegistered){
                        return res.status(201).json({message: 'Usuário criado com sucesso', data: userRegistered})
                    }else{
                        return res.status(403).json({message: 'E-mail já registrado', field: 'email'})
                    }
                } catch (error) {
                    return res.status(403).json({message: 'E-mail já registrado', field: 'email'})
                }
            } catch (error) {
                res.status(500).json({message: error.message})
            }
        }).catch(function (err) {
            res.status(500).json({message: err.errors[0], field: err.path})
        });
    },

    async delete(req, res){
        try {
            const userModel = new User()
            const {user_id} = req.body

            //Get user logged id e select your type (user, admin ...)
            const userAuthenticated = req.user.id
            const getType = await userModel.where({id: userAuthenticated}, ['type'])

            // Cheks if the user logged is admin or if the user id that will be deleted is equal to logged
            if(getType == 'admin' || userAuthenticated == user_id){
                try {
                    const userModel = new User()
                    await userModel.delete(user_id)
                    return res.status(200).json({message: "User deleted", data: {user_id}})
                } catch (error) {
                    return res.status(404).json({message: error.message})
                }
            }else{
                return res.status(500).json({message: 'Permission denied'})
            }  

        } catch (error) {
            return res.status(500).json({message: error.message})
        } 
    },
    
    async update(req, res){
        try {
            const userModel = new User()
            const user_id = req.params.id
            const {email, fullname, birth, nickname} = req.body

            if(email) {
                updateUserEmail(user_id, email, res)
            }

            if(nickname) {
                updateUserNickname(user_id, nickname, res)
            }

            //Get user logged id e select your type (user, admin ...)
            const userAuthenticated = req.user.id
            const getType = await userModel.where({id: userAuthenticated}, ['type'])
            // Cheks if the user logged is admin or if the user id that will be deleted is equal to logged
            if(getType == 'admin' || userAuthenticated == user_id){
                try {
                    const userModel = new User()
                    await userModel.update({id: user_id}, {fullname, birth})
                    return res.status(200).json({message: "User Updated", data: {user: user_id}})
                } catch (error) {
                    return res.status(404).json({message: error.message})
                }
            }else{
                return res.status(500).json({message: 'Permission denied'})
            }  

        } catch (error) {
            return res.status(500).json({message: error.message})
        } 
    }

    
}

async function updateUserEmail(user_id, email, res){
    //check if email has been registered
    const userModel = new User()
    const emailRegistred =  await userModel.where({email}, ['email'])
    if(emailRegistred.length >= 1){
        return res.status(500).json({message: 'E-Mail já registrado'})
    }else{
        await userModel.update({id: user_id}, {email})
         return true;
    }
}

async function updateUserNickname(user_id, nickname, res){
    //check if nickname has been registered
    const userModel = new User()
    const nicknameRegistered =  await userModel.where({nickname}, ['nickname'])
    if(nicknameRegistered.length >= 1){
        return res.status(500).json({message: 'Nickname já registrado'})
    }else{
        await userModel.update({id: user_id}, {nickname})
         return true;
    }
}