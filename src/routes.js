const express = require('express')
const Router = express.Router()

const UsersController = require('./controllers/UsersController')

Router.post('/users', UsersController.store)

module.exports = Router