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
  return bcrypt.compareSync(password, user.password);
};

// Generar el token
const generateToken = (user) => {
  return jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '1h' });
};

const validateToken = (req, res, next) => {
  const token = req.cookies.rodsCookie;
  if (!token) {
    return res.status(401).send({ status: 'error', error: 'Not authenticated' });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_PRIVATE_KEY);
    req.user = decodedToken.user;
    next();
  } catch (error) {
    return res.status(401).send({ status: 'error', error: 'Invalid token' });
  }
};

const setTokenCookie = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ status: 'error', error: 'Not authenticated' });
  }
  
  const token = generateToken(req.user);
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });

  next();
};

// Para estrategias basadas en Headers con JWT
const authHeaderToken = (req, res, next) => {
  if (!req || !req.cookies || !req.cookies.rodsCookie) {
    return res.status(401).send({ status: "error", error: "Not authenticated" });
  }

  const token = req.cookies.rodsCookie;
  if (!token) {
    return res.status(401).send({ status: "error", error: "Not authenticated" });
  }

  jwt.verify(token, JWT_PRIVATE_KEY, (err, credentials) => {
    if (err) {
      return res.status(403).send({ status: "error", error: "Not authorized" });
    }
    if (!credentials || !credentials.user) {
      return res.status(403).send({ status: "error", error: "Not authorized" });
    }
    req.user = credentials.user;
    next();
  });
};

// Obtener el token del header y verificarlo. Para estrategia basada en JWT
const getToken = (req, res, next) => {
  const token = req.header.authorization;

  if (!token) {
    throw new Error( "Not authenticated" );
  }

  const [bearer, tokenValue] = token.split(" ");
  if (bearer !== "Bearer" || !tokenValue) {
    throw new Error( "Invalid token format" );
  }
  jwt.verify(tokenValue, JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      throw new Error( "Invalid token" );
    }
    req.user = decoded;
    next();
  });
};

const jwtMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  jwt.verify(token.split(" ")[1], JWT_PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
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
  authHeaderToken,
  soldProducts,
  getToken,
  generateToken,
  setTokenCookie,
  jwtMiddleware,
};
