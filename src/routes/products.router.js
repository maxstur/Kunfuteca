const { Router } = require("express");
const ProductsController = require("../controllers/products.controller");
const getToken = require("../middlewares.js/getToken.middleware");
const checkRole = require("../middlewares.js/checkRole.middleware");

const productsRouter = Router();

productsRouter.get("/", ProductsController.getAll);
productsRouter.get("/:id", ProductsController.getById);
productsRouter.post("/", getToken, checkRole("ADMIN"), ProductsController.create);
productsRouter.put("/:id", getToken, checkRole("ADMIN"), ProductsController.update);
productsRouter.delete("/:id", getToken, checkRole("ADMIN"), ProductsController.delete);

module.exports = productsRouter;

