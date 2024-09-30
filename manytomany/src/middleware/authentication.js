const JWT = require('jsonwebtoken')

const authentication = (req,res,next)=>{
const token = req.cokkies.jwtToken
if (!token)  return res.stauts(401).json({msg : "you are not authorized"})
try {
  const decoded=JWT.verify(token,process.env.secret)
} catch (error) {
  return res.stauts(400).json({msg :"Invalid Token"})
}
}

module.exports = authentication