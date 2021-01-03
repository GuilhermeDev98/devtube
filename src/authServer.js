require("dotenv").config();

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []

/*Para criar um secret token usar o seguinte comando => require('crypto').randomBytes(64).toString('hex'); */

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  const tokenAccess = req.body.tokenAccess
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
 
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({auth: user.auth, id: user.id })
    res.json({ accessToken: accessToken })
  })
  
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.json({ auth: false, accessToken: null });
})

app.post('/login', (req, res, next) => {
  // Authenticate User
    
    //const username = await db.User.findOne({ username });
    //const password = !bcrypt.compareSync(password, user.passwordHash;
    // if (!user || !bcrypt.compareSync(password, user.passwordHash)) {

  const username = "Jim"; //Verificação no Banco de dados
  const password = "0123456789" //Verificação no Banco de dados com hash

  /* 
  
    const userDb = await db.User.findOne({ username });
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw 'Username or password is incorrect';
    }
  
  */

  if (req.body.username !== username || req.body.password !== password){ //Verificação no Banco de dados
    throw res.status(203).json({message: 'Username or password is incorrect'}) ;
  }

  const idUser = 2; //Verificação no Banco de dados
  const user = {id: idUser};
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  res.json({ auth: true, accessToken: accessToken, refreshToken: refreshToken })

})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
}

const PORT = process.env.APP_PORT2
app.listen(PORT, () => {
  console.info(`Server Running on Port ${PORT}`)
})  