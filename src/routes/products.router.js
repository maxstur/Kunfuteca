const { Router } = require("express");
const ProductsController = require("../controller/products.controller");

const viewsRouter = Router();

viewsRouter.get("/", ProductsController.getAll)
viewsRouter.get("/:id", ProductsController.getById);
viewsRouter.post("/", ProductsController.create);
viewsRouter.put("/:pid", ProductsController.update);
viewsRouter.delete("/:id", ProductsController.delete);

module.exports = viewsRouter;
