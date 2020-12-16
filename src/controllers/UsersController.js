const User = require('../models/User')

module.exports = {
    async store(req, res){
        try {
            const user = new User(req.body)
            await user.store()
            res.status(201).send()
        } catch (error) {
            res.status(500).send(error)
        }
    }
}