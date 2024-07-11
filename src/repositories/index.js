const {
  UsersDao,
  ProductsDao,
  TicketsDao,
  CartsDao,
} = require("../dao/factory");

const UsersService = require("../services/user.service");
const ProductsService = require("../services/products.service");
const TicketService = require("../services/ticket.service");
const CartsService = require("../services/cart.service");

const usersService = new UsersService(new UsersDao());
const productsService = new ProductsService(new ProductsDao());
const ticketsService = new TicketService(new TicketsDao());
const cartsService = new CartsService( new CartsDao(), productsService, ticketsService);

module.exports = {
  cartsService,
  productsService,
  usersService,
  ticketsService,
};
