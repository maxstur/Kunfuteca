const { Router } = require("express");
const CartsManager = require("../dao/dbManagers/carts.manager");
const ProductsManager = require("../dao/dbManagers/products.manager");
const ViewsController = require("../controllers/views.controller");
const getToken = require("../middlewares.js/getToken.middleware");
const  checkRole = require("../middlewares.js/checkRole.middleware");
const publicAccess= require("../middlewares.js/publicAccess.midleware");
const privateAccess= require("../middlewares.js/privateAccess.midleware");

const productManager = new ProductsManager();
const cartManager = new CartsManager();

const viewsRouter = Router();

viewsRouter.get("/", ViewsController.getProductsHome);
viewsRouter.get("/realtimeproducts", ViewsController.getRealTimeProducts);
viewsRouter.get("/chat", getToken, checkRole("USER"), ViewsController.getChat);
viewsRouter.get("/calcNoBlocking", ViewsController.getCalcNoBlocking);
viewsRouter.get("/soldProducts", ViewsController.getSoldProducts);
viewsRouter.get("*", ViewsController.get404);

/** Auth */
viewsRouter.get("/register", publicAccess, ViewsController.getRegister);
viewsRouter.get("/login", publicAccess, ViewsController.getLogin);
viewsRouter.get("/", privateAccess, ViewsController.getProfile);
viewsRouter.get("/resetPassword", getToken, checkRole("USER"), ViewsController.getResetPassword);
viewsRouter.get("/logout", getToken, checkRole("USER"), ViewsController.getLogout);

/** products with token */
viewsRouter.get("/products", getToken, ViewsController.getProducts);
viewsRouter.get("/products.alt", ViewsController.getProductsAlternative);
viewsRouter.get("/products/:pid", ViewsController.getProductById);

/** Carts with token */
viewsRouter.get("/carts/:cid", ViewsController.getCartById);
viewsRouter.get("/carts/:cid/products", ViewsController.getCartProducts);

module.exports = viewsRouter;
