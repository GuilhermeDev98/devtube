require('dotenv').config()

const express = require('express')
const app = express()
const routes = require('./routes')

const PORT = process.env.APP_PORT | 3333

app.use('/', routes)

app.listen(PORT, () => {
    console.info(`Server Running on Port ${PORT}`)
})