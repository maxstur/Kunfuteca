const dotenv = require("dotenv");

dotenv.config();

const { PORT, ENVIRONMENT, MONGO_CONNECTOR_LINK, JWT_PRIVATE_KEY, SESSION_SECRET } =
  process.env;

module.exports = {
  MONGO_CONNECTOR_LINK,
  JWT_PRIVATE_KEY,
  PORT,
  ENVIRONMENT,
  //SESSION_SECRET
};
