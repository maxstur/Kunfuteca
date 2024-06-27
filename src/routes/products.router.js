const { Router } = require("express");
const ProductsController = require("../controllers/products.controller");
const CustomRouter = require("./custom.router");

const router = Router();

class ProductsRouter extends CustomRouter {
  initialize() {
    this.get("/", ["PUBLIC"], ProductsController.getAll);
    this.get("/:id", ["PUBLIC"], ProductsController.getById);
    this.post("/", ["ADMIN", "USER"], ProductsController.create);
    this.put("/:pid", ["ADMIN", "USER"], ProductsController.update);
    this.delete("/:id", ["ADMIN", "USER"], ProductsController.delete);
  }
}

module.exports = new ProductsRouter();
