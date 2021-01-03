require("dotenv").config();

const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')

const jwt = require("jsonwebtoken");

const app = express()
const routes = require('./routes')

const PORT = process.env.APP_PORT
const APP_VERSION = process.env.APP_VERSION

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.json())

//app.use(`/api/${APP_VERSION}`, routes);
app.use(routes)

app.listen(PORT, () => {
    console.info(`Server Running on Port ${PORT}`)
})