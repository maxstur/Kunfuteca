const bcrypt = require("bcrypt");

// Utilizamos "HashSync" de bcrypt para encriptar la contraseña
// Y "genSaltSync" para generar un salt o sea una cadena aleatoria y el número es la longitud
// de caracteres.

const createHash = (password) => {
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    return hashedPassword;
}

// Validar que la contraseña coincida con "CompareSync" de bcrypt
const isValidPassword = (user, password) => {
    const isValid = bcrypt.compareSync(password, user.password);
    return isValid;
}
module.exports = {
    createHash, isValidPassword
}