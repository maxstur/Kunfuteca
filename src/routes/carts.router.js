const { Router } = require("express");
const CartsController = require("../controllers/carts.controller");

const cartsRouter = Router();

cartsRouter.post("/", CartsController.create);
cartsRouter.get("/:id", CartsController.getById);
cartsRouter.post("/:id/product/:pid", CartsController.addProduct);
cartsRouter.delete("/:cid/product/:pid", CartsController.deleteProduct);
cartsRouter.put("/:id/product/:pid", CartsController.updateProductQuantity);
cartsRouter.put("/:id", CartsController.updateCartProducts);
cartsRouter.delete("/:id", CartsController.cleanCart);

module.exports = cartsRouter;
