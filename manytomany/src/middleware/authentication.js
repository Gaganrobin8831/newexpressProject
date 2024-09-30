const JWT = require('jsonwebtoken')

const authenticate = (req,res,next)=>{
const token2 = req.cookies.token || req.headers.authorization?.split(' ')[1]
if (!token2)  return res.status(401).json({msg : "you are not authorized"})
try {
  const decoded=JWT.verify(token2,process.env.secret)
  // console.log({decoded});
  
  req.user = decoded
  next()
} catch (error) {
  return res.status(400).json({msg :"Invalid Token"})
}
}

module.exports = authenticate