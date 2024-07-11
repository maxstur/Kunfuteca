const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

// Utilizamos "HashSync" de bcrypt para hashear la contraseña
// Y "genSaltSync" para generar un salt o sea una cadena aleatoria y el número es la longitud
// de caracteres.

const createdHash = (password) => {
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(20));
  return hashedPassword;
};

// Validar que la contraseña coincida con "CompareSync" de bcrypt
const isValidPassword = (user, password) => {
  console.log("Comparing passwords");
  const result = bcrypt.compareSync(password, user.password);
  console.log("Passwords Comparison Result: ", result);
  return result;
};

// Generar el token
const generateToken = (user) => {
  return jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: "1h" });
};


const setTokenCookie = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .send({ status: "error", error: "Not authenticated" });
  }

  const token = generateToken(req.user);
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  next();
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
  soldProducts,
  generateToken,
  setTokenCookie,
};
