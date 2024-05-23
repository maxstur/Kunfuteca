const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const getToken = (req, res, next) => {
  let token = req.cookies.rodsCookie;
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).send("No autorizado");
    } else {
      req.tokenUser = decodedToken;
      next();
    }
  });
};

module.exports = {
  createdHash,
  isValidPassword,
  getToken,
};
