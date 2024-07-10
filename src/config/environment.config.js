const dotenv = require("dotenv");
// const {Command}= require("commander");

dotenv.config();

// const program = new Command();
// program.option("--mode <modo>").parse(process.argv);
// const options = program.opts();
// console.log(options, "options");

module.exports = {
  MONGO_CONNECTOR_LINK: process.env.MONGO_CONNECTOR_LINK,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  PORT: process.env.PORT,
  ENVIRONMENT: process.env.ENVIRONMENT,
  EMAIL_ADMIN_1: process.env.EMAIL_ADMIN_1,
  EMAIL_ADMIN_2: process.env.EMAIL_ADMIN_2,
  EMAIL_ADMIN_3: process.env.EMAIL_ADMIN_3,
  PASSWORD_ADMIN_1: process.env.PASSWORD_ADMIN_1,
  PASSWORD_ADMIN_2: process.env.PASSWORD_ADMIN_2,
  PASSWORD_ADMIN_3: process.env.PASSWORD_ADMIN_3,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};
