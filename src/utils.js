const jwt = require("jsonwebtoken");
const passport = require('passport')
const config = require('./config/jwt.config')

/** JWT */
const JWT_SECRET = config.JWT_SECRET;

const generateToken = (user) => {
  delete user.password;
  const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "4hs" });
  return token;
};

const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .send({ status: "error", error: "Not authenticated" });
  }
  //authorization: 'bearer asdjfdksadf'
  const token = authHeader.split(" ")[5];
  jwt.verify(token, JWT_SECRET, (error, credentials) => {
    if (error) {
      return res.status(403).send({ status: "error", error: "Not authorized" });
    }

    req.user = credentials.user;
    next();
  });
};

const callPassport = (strategy)=>{
  return(req, res, next)=>{
    passport.authenticate(strategy, function(err, user, info){
      if(err) {return next(err)}
      if(!user) {
        return res.status(401).send({status:'error', error: info.messages ? info.messages:info.toString()})
      }

      req.user = user;
      next();
    })(req, res, next)
  }
}

const checkRoleAuthorization = (targettedRole)=>{
  return  (req, res, next)=>{
    if(!req.user) return res.status(401).send({status:'error', error:'wrong credentials'})
    if(req.user.role != targettedRole) return res.status(403).send({status:'error', error:'not authorized'})

    next();
  }
}

module.exports = {
  generateToken,
  authToken,
  callPassport,
  checkRoleAuthorization
};
