const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
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
  const userObject = user.toObject ? user.toObject() : user;
  const { password, ...deletePasswordFromUser } = userObject;
  const token = jwt.sign({ payload: deletePasswordFromUser }, JWT_PRIVATE_KEY, {
    expiresIn: "1h",
  });
  return token;
};

// Para estrategias basadas en Headers con JWT
const authHeaderToken = (req, res, next) => {
  // console.log(req.cookies);
  const authHeader = undefined;
  if (!req.cookies || !req.cookies.rodsCookie) {
    return res
      .status(401)
      .send({ status: "error", error: "Not authenticated" });
  }

  req.headers.cookie.split('; ');

  // token, authorization header: "Bearer token"
  const token = req.cookies.rodsCookie;
  jwt.verify(token, JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send({ status: "error", error: "Not authorized" });
    }
    req.user = decoded.payload;
    next();
  });
};

// Obtener el token de la cookie y verificarlo. Para estrategias basadas en Cookies
const getToken = (req, res, next) => {
  let token = req.cookies.rodsCookie;
  if (!token) {
    return res.status(403).send({ status: "error", error: "Not authorized" });
  }

  jwt.verify(token, JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) res.status(403).send({ status: "error", error: "Not authorized" });
    req.user = decoded.payload;
    next();
  });
};

// const callPassport = (strategy) => {
//   return (req, res, next) => {
//     passport.authenticate(strategy, { session: false }, async (err, user, info) => {
//       if (err) {
//         return res.status(500).send({ status: "error", error: err.message });
//       }
//       if (!user) {
//         return res.status(401).send({
//           status: "error",
//           error: info.message ? info.message : info.toString(),
//         });
//       }
//       req.user = user;
//       next();
//     })(req, res, next);
//   };
// };

// const checkRoleAuthorization = (...targettedRoles) => {
//   return (req, res, next) => {
//     if (
//       !req.user ||
//       !req.user.role ||
//       !req.user.admin ||
//       !targettedRoles.includes(req.user.role)
//     ) {
//       return res.status(403).send({ status: "error", error: "Not authorized" });
//     }
//     next();
//   };
// };

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
  authHeaderToken,
  //callPassport,
  //checkRoleAuthorization,
  soldProducts,
  getToken,
};
