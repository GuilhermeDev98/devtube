const express = require('express')
const Router = express.Router()

const AuthenticateToken = require('./middleware/AuthenticateToken')

const UsersController = require('./controllers/UsersController')
const AuthController = require('./controllers/AuthController')

//REGISTER
Router.get('/users', UsersController.get)
Router.post('/users', UsersController.store)
Router.delete('/users', UsersController.delete)

//AUTHENTICATION
Router.post('/auth', AuthController.login)
Router.post('/refreshToken', AuthController.refreshToken)
Router.get('/logged', AuthenticateToken , AuthController.logged)
Router.delete('/logout', AuthController.logout)


module.exports = Router