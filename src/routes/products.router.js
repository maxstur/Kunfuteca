const { Router } = require("express");
const ProductsController = require("../controllers/products.controller");
const { authToken } = require("../utils");

const productsRouter = Router();

productsRouter.get("/products-all", ProductsController.getAll);
productsRouter.get("/:id", ProductsController.getById);
productsRouter.post("/", ProductsController.create);
productsRouter.put("/:pid", ProductsController.update);
productsRouter.delete("/:id", ProductsController.delete);

module.exports = productsRouter;
