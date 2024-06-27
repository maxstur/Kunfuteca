const { Router } = require("express");
const CartsController = require("../controllers/carts.controller");

const viewsRouter = Router();

viewsRouter.post("/", CartsController.create);
viewsRouter.get("/:id", CartsController.getCartById);
viewsRouter.post("/:id/product/:pid", CartsController.addProduct);
viewsRouter.delete("/:cid/product/:pid", CartsController.deleteProduct);
viewsRouter.put("/:id/product/:pid", CartsController.updateProductQuantity);
viewsRouter.put("/:id", CartsController.updateCartProducts);
viewsRouter.delete("/:id", CartsController.cleanCart);

module.exports = viewsRouter;
