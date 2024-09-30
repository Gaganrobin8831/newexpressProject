const authorize = (roles = [])=>{
    if(typeof roles === 'string') roles = [roles]

    return (req,res,next)=>{
        if (!roles.includes(req.user.role)) {
            return res.stauts(403).json({msg :"acces Denied"})
        }
        next();
    }
}

module.exports = authorize