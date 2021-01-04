const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    const authHeader = req.headers['access-token']; 
    if (!authHeader) return res.status(401).json({ auth: false, message: 'No token provided.' });  
    jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, function(err, user){
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      req.user = user
      next()
    });
  }