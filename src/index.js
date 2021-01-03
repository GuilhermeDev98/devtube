require("dotenv").config();

const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')

const jwt = require("jsonwebtoken");


const app = express()
const routes = require('./routes')

const UsersController = require('./controllers/UsersController')

const PORT = process.env.APP_PORT
const APP_VERSION = process.env.APP_VERSION

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(`/api/${APP_VERSION}`, routes);



/*================================ROUTER_AUTHENTICATION=================================*/
app.use(express.json())

const posts = [  //Exemplo de BD, remover assim que implementar o BD real
  {
    Id:1,
    Email:'kyle@gmail.com',
    Password: '0123456789',
    Fullname: 'kyle smith',
    Birth: '01/01/2021',
    Nickname: 'Kyle',
    StreamKey: 'keyStream',
    ChannelId: '0486324',
    CreatedAt: '',
    UpdatedAt: ''
  },
  {
    Id:2,
    Email:'Jim@gmail.com',
    Password: '0123456789',
    Fullname: 'Jim Scot',
    Birth: '01/01/2021',
    Nickname: 'Jim',
    StreamKey: 'keyStream',
    ChannelId: '9566132',
    CreatedAt: '',
    UpdatedAt: ''
  }
]

app.get('/logged', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.Id === req.user.id)); //Envia resultado do banco de dados para o usuário de acordo com o ID
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['access-token'];
  if (!authHeader) return res.status(401).json({ auth: false, message: 'No token provided.' });
  console.log("Token:",authHeader);
 
  jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, function(err, user){
    console.log(err)
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    req.user = user
    next()
  });
}

app.listen(PORT, () => {
    console.info(`Server Running on Port ${PORT}`)
})