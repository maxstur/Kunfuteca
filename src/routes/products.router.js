const { Router } = require("express");
const ProductsController = require("../controllers/products.controller");

const productsRouter = Router();

productsRouter.get("/", ProductsController.getAll);
productsRouter.get("/:id", ProductsController.getById);
productsRouter.post("/", ProductsController.create);
productsRouter.put("/:id", ProductsController.update);
productsRouter.delete("/:id", ProductsController.delete);

module.exports = productsRouter;

