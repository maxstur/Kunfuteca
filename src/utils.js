const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Utilizamos "HashSync" de bcrypt para hashear la contraseña
// Y "genSaltSync" para generar un salt o sea una cadena aleatoria y el número es la longitud
// de caracteres.

const createHash = (password) => {
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(20));
  return hashedPassword;
};

// Validar que la contraseña coincida con "CompareSync" de bcrypt
const isValidPassword = (user, password) => {
  const isValid = bcrypt.compareSync(password, user.password);
  return isValid;
};


const generateToken = (user) => {
  delete user.password;
  const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "4h, 5m" });
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
