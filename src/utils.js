const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("./config/config");
const passport = require("passport");

// Utilizamos "HashSync" de bcrypt para hashear la contraseña
// Y "genSaltSync" para generar un salt o sea una cadena aleatoria y el número es la longitud
// de caracteres.

const createdHash = (password) => {
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(20));
  return hashedPassword;
};

// Validar que la contraseña coincida con "CompareSync" de bcrypt
const isValidPassword = (user, password) => {
  const isValid = bcrypt.compareSync(password, user.password);
  return isValid;
};

// Generamos un token
const generateToken = (user) => {
  delete user.password;
  const token = jwt.sign({ user }, JWT_PRIVATE_KEY, {
    expiresIn: "2h",
  });
  return token;
};

const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ status: "error", error: "Not authenticated" });
  }

  // token, authorization header: "Bearer token"
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_PRIVATE_KEY, (err, credentials) => {
    if (err) {
      return res.status(403).send({ status: "error", error: "Not authorized" });
    }
    req.user = credentials.user;
    next();
  });
};

const callPassport = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, function(err, user, info) {
      if (err) {
        return res.status(500).send({ status: "error", error: err.message });
      }
      if (!user) {
        return res.status(401).send({ status: "error", error: info.message ? info.message : info.toString() });
      }
      req.user = user;
      next();
      
    })(req, res, next);
  }
};

const checkRoleAuthorization = (targettedRole) => {
  return (req, res, next) => {
    if (req.user.role !== targettedRole) {
      return res.status(403).send({ status: "error", error: "Not authorized" });
    }

    if (!req.user || !req.user._id || !req.user.role || !req.user.admin) {
      return res.status(401).send({ status: "error", error: "Not authenticated, register and login first" });
    }

    next();
  }
}

module.exports = {
  createdHash,
  isValidPassword,
  generateToken,
  authToken,
  callPassport,
  checkRoleAuthorization
};
