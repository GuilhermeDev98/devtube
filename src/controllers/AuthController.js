const Auth = require('../models/Auth')
const jwt = require('jsonwebtoken')

let refreshTokens = []

module.exports = {
    
    async login(req, res){

        const data = req.body

        if(!data.email){
            res.status(203).json({message: 'Email is required'})
        }

        if(!data.password){
            res.status(203).json({message: 'Email is required'})
        }

        const modelUser = new Auth()
        const user = await modelUser.authenticate(data)
        const userId = { id: user}
        if(user!== undefined){
            const accessToken = generateAccessToken(userId)
            const refreshToken = jwt.sign(userId, process.env.REFRESH_TOKEN_SECRET)
            refreshTokens.push(refreshToken)
            res.json({ auth: true, accessToken: accessToken, refreshToken: refreshToken })
        }else{
            res.status(203).json({message: 'Username or password is incorrect'}) ;
        }
    },
    async refreshToken(req, res){
       
        const refreshToken = req.body.refreshToken
        const accessToken = req.body.accessToken
        if (refreshToken == null) return res.sendStatus(401)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err) => {
            if (err) return res.sendStatus(403)
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
             if (err) return res.sendStatus(403)
                const accessToken = generateAccessToken({auth: user.auth, id: user.id })
                res.json({ accessToken: accessToken })
            })
        })
    },

    async logged(req, res){
        const modelUser = new Auth()
        const data = req.user
        const user = await modelUser.logged(data)
        res.json(user);
    },

    async logout(req, res){
       
        refreshTokens = refreshTokens.filter(token => token !== req.body.refreshToken)
        res.json({ auth: false, accessToken: null })
         
    }
    
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600s' });
}
