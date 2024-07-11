const { CartsDao, ProductsDao, UsersDao, TicketsDao } = require("../dao/factory");

const ProductsService = require("./products.services");
const UsersService = require("./users.services");
const TicketService = require("./tickets.services");
const CartsService = require("./carts.services");

const productsService = new ProductsService(new ProductsDao());
const usersService = new UsersService(new UsersDao());
const ticketsService = new TicketService(new TicketsDao());
const cartsService = new CartsService(new CartsDao(), productsService, ticketsService);

module.exports = {
  cartsService,
  productsService,
  usersService,
  ticketsService,
};
