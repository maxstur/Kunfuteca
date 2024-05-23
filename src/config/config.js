const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    mongoConnectorLink: process.env.MONGO_CONNECTOR_LINK,
    JWT_SECRET: process.env.JWT_SECRET,
    port: process.env.PORT,
    sesSecret: process.env.SESSION_SECRET
}