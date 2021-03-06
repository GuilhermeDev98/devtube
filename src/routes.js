const express = require('express')
const Router = express.Router()

const AuthenticateToken = require('./middleware/AuthenticateToken')

const UsersController = require('./controllers/UsersController')
const AuthController = require('./controllers/AuthController')

//REGISTER
Router.get('/users/:id?', AuthenticateToken, UsersController.index)
Router.post('/users', UsersController.store)
Router.put('/users/:id', AuthenticateToken, UsersController.update)
Router.delete('/users', AuthenticateToken, UsersController.delete)

//AUTH
Router.post('/auth', AuthController.auth)
Router.post('/refreshToken', AuthController.refreshToken)
Router.get('/login', AuthenticateToken , AuthController.login)
Router.delete('/logout', AuthController.logout)
Router.post('/auth/forgot' , AuthController.forgot)
Router.get('/auth/forgot' , AuthController.alterPassword)


module.exports = Router