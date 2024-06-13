const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("./config/environment.config");
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
  return bcrypt.compareSync(password, user.password);
};

// Generamos un token
const generateToken = (user) => {
  delete user.password;
  const token = jwt.sign({ payload: user }, JWT_PRIVATE_KEY, {
    expiresIn: "1h",
  });
  return token;
};

const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .send({ status: "error", error: "Not authenticated" });
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

// Obtener el token de la cookie y verificarlo
const getToken = (req, res, next) => {
  let token = req.cookies.rodsCookie;
  if (!token)
    return res.status(403).send({ status: "error", error: "Not authorized" });
  jwt.verify(token, JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) res.status(403).send("Not authorized");
    req.tokenUser = decoded.payload;
    next();
  });
};

const callPassport = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        return res.status(500).send({ status: "error", error: err.message });
      }
      if (!user) {
        return res.status(401).send({
          status: "error",
          error: info.message ? info.message : info.toString(),
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

const checkRoleAuthorization = (...targettedRoles) => {
  return (req, res, next) => {
    if (
      !req.user ||
      !req.user.role ||
      !req.user.admin ||
      !targettedRoles.includes(req.user.role)
    ) {
      return res.status(403).send({ status: "error", error: "Not authorized" });
    }
    next();
  };
};

function soldProducts() {
  // llamada operaciónCompleja
  console.log("Cantidad de productos vendidos (Cálculo bloqueante)...");
  let result = 0;
  for (let i = 0; i < 4000000000; i++) {
    result += i;
  }
  return result;
}

module.exports = {
  createdHash,
  isValidPassword,
  generateToken,
  authToken,
  callPassport,
  checkRoleAuthorization,
  soldProducts,
  getToken,
};
