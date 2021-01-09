const User = require('../models/User')
const knex = require('../config/database')
const UserStoreValidator = require('../Http/Validators/User/Store')

module.exports = {
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
                        return res.status(500).json({message: 'E-Mail já registrado', field: 'email'})
                    }
                } catch (error) {
                    return res.status(500).json({message: 'E-Mail já registrado', field: 'email'})
                }
            } catch (error) {
                res.status(500).json({message: error.message})
            }
        }).catch(function (err) {
            res.status(500).json({message: err.errors[0], field: err.path})
        });
    },

    async get(req, res){
        const userModel = new User()
        const {user_id} = req.body

        try {
            const user = await userModel.where(user_id, ['id', 'email', 'fullname', 'birth', 'nickname', 'type', 'active'])
            return res.status('200').json({data: {user}})
        } catch (error) {
            res.status(500).json({message: 'User not found'})
        }     
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
    }
}