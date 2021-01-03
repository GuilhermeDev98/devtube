const User = require('../models/User')
const jwt = require('jsonwebtoken')

let refreshTokens = []

module.exports = {
    
    async login(req, res){
        const modelUser = new User()
        const data = req.body
        const user = await modelUser.find(data)
        const userId = { userId: user[0]}

        console.log(userId)


        const accessToken = generateAccessToken(userId)
        const refreshToken = jwt.sign(userId, process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken)
        res.json({ auth: true, accessToken: accessToken, refreshToken: refreshToken })

    },
    async token(req, res){
       
        const refreshToken = req.body.token
        if (refreshToken == null) return res.sendStatus(401)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
        
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken({auth: user.auth, id: user.id })
            res.json({ accessToken: accessToken })
        })
        
    },

    async logged(req, res){

        res.json(posts.filter(post => post.Id === req.user.id)); //Envia resultado do banco de dados para o usuário de acordo com o ID
           
    },

    async logout(req, res){
       
        refreshTokens = refreshTokens.filter(token => token !== req.body.token)
        res.json({ auth: false, accessToken: null })
         
    }
    
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
}

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