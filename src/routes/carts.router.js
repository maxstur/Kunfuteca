const { Router } = require("express");
const CartsController = require("../controllers/carts.controller");
const getToken = require("../middlewares.js/getToken.middleware");
const checkRole = require("../middlewares.js/checkRole.middleware");

const cartsRouter = Router();

cartsRouter.post("/", CartsController.create);
cartsRouter.get("/:id", CartsController.getById);
cartsRouter.post("/:id/product/:pid", getToken, checkRole("USER"), CartsController.addProduct);
cartsRouter.delete("/:cid/product/:pid", CartsController.deleteProduct);
cartsRouter.put("/:id/product/:pid", CartsController.updateProductQuantity);
cartsRouter.put("/:id", CartsController.updateCartProducts);
cartsRouter.delete("/:id", CartsController.cleanCart);
cartsRouter.get("/:id/purchase", getToken, checkRole("USER"), CartsController.purchase);

module.exports = cartsRouter;
