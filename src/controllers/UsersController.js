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
        const {user_id} = req.body
        const userModel = new User()
        try {
            const user = await userModel.where(user_id, ['id', 'email', 'fullname', 'birth', 'nickname'])
            return res.status('200').json({data: {user}})
        } catch (error) {
            res.status(500).json({message: 'Usuário não encontrado'})
        }
    },
}