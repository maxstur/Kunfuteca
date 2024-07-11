const mongoose = require("mongoose");
const { MONGO_CONNECTOR_LINK } = require("../config/environment.config");

let CartsDao;
let ProductsDao;
let UsersDao;
let TicketsDao;

mongoose
  .connect(MONGO_CONNECTOR_LINK)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Couldn't connect to MongoDB", err);
  });

CartsDao = require("./dbManagers/carts.dao");
ProductsDao = require("./dbManagers/products.dao");
UsersDao = require("./dbManagers/users.dao");
TicketsDao = require("./dbManagers/tickets.dao");

module.exports = {
  CartsDao,
  ProductsDao,
  UsersDao,
  TicketsDao,
};
