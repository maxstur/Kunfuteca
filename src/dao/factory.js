let ProductsDao;
let UsersDao;
let TicketsDao;
let CartsDao;

function initialize() {
  ProductsDao = require("./dbManagers/products.dao");
  UsersDao = require("./dbManagers/users.dao");
  TicketsDao = require("./dbManagers/tickets.dao");
  CartsDao = require("./dbManagers/carts.dao");
}

module.exports = {
  initialize,
  ProductsDao,
  UsersDao,
  TicketsDao,
  CartsDao,
};
