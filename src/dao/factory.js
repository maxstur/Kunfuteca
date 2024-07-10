const { default: mongoose } = require("mongoose");

const { ENVIRONMENT } = require("../config/environment.config");

let CartsDao;
let ProductsDao;
let UsersDao;
let TicketsDao;

switch (ENVIRONMENT) {
  case "MONGO":
    mongoose
      .connect(process.env.MONGO_CONNECTOR_LINK)
      .then(() => {
        console.log("MongoDB connected successfully");
      })
      .catch((err) => {
        console.error("Could not connect to MongoDB", err);
      });

    CartsDao = require("./dbManagers/carts.dao");
    ProductsDao = require("./dbManagers/products.dao");
    UsersDao = require("./dbManagers/users.dao");
    TicketsDao = require("./dbManagers/tickets.dao");

    break;
  case "MEMORY":
    break;
}

module.exports = {
  CartsDao,
  ProductsDao,
  UsersDao,
  TicketsDao,
};
