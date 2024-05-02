const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { JWT_SECRET } = require("./config/jwt.config");

// Utilizamos "HashSync" de bcrypt para hashear la contraseña
// Y "genSaltSync" para generar un salt o sea una cadena aleatoria y el número es la longitud
// de caracteres.

const createHash = (password) => {
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(20));
  return hashedPassword;
};

// Validar que la contraseña coincida con "CompareSync" de bcrypt
const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

const generateToken = (req, res, next) => {
  let token = req.coockie.rodsCookie;
  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).send({ status: "error", error: "Not authorized" });
    } else {
      req.tokenUser = decoded;
      next();
    }
  });
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

const callPassport = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send({
          status: "error",
          error: info.messages ? info.messages : info.toString(),
        });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

const checkRoleAuthorization = (targettedRole) => {
  return (req, res, next) => {
    if (!req.user)
      return res
        .status(401)
        .send({ status: "error", error: "wrong credentials" });
    if (req.user.role != targettedRole)
      return res.status(403).send({ status: "error", error: "not authorized" });

    next();
  };
};

module.exports = {
  createHash,
  isValidPassword,
  generateToken,
  authToken,
  callPassport,
  checkRoleAuthorization,
};
