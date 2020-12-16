require('dotenv').config()

const express = require('express')
const app = express()
const routes = require('./routes')
const bodyParser = require('body-parser')

const PORT = process.env.APP_PORT | 3333
const APP_VERSION = process.env.APP_VERSION

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(`/api/${APP_VERSION}`, routes)

app.listen(PORT, () => {
    console.info(`Server Running on Port ${PORT}`)
})