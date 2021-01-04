const User = require('../models/User')

module.exports = {
    async store(req, res){
        try {
            
            const user = new User(req.body)
            const userId = await user.store()
            res.json(userId)

        } catch (error) {
            res.status(500).json(error)
        }
    },

    async get(req, res){
        res.json('ok')
    }
}