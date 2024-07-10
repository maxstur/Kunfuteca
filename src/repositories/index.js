const { CartsDao, ProductsDao, UsersDao } = require("../dao/factory");

const CartsService = require("./carts.services");
const ProductsService = require("./products.services");
const UsersService = require("./users.services");

const cartsService = new CartsService(new CartsDao(), productsService);
const productsService = new ProductsService(new ProductsDao());
const usersService = new UsersService(new UsersDao());


module.exports = {
    cartsService,
    productsService,
    usersService,
}