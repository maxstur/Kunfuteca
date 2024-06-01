const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    mongoConnectorLink: process.env.MONGO_CONNECTOR_LINK,
    JWT_PRIVATE_KEY: process.env.JWT_SECRET,
    port: process.env.PORT,
    sesSecret: process.env.SESSION_SECRET
}