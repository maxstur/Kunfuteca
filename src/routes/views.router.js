const { Router } = require("express");
const { authToken } = require("../utils");
// const { publicAccess } = require("../middlewares/prublicAccess.middleware");
// const { privateAccess } = require("../middlewares/privateAccess.middleware");
const ViewsController = require("../controllers/views.controller");

const viewsRouter = Router();

/** views */
viewsRouter.get("/", ViewsController.getProductsHome);
viewsRouter.get("/realtimeproducts", ViewsController.getRealTimeProducts);
viewsRouter.get("/chat", ViewsController.getChat);

/** products with token */
viewsRouter.get("/products", authToken, ViewsController.getProducts);
viewsRouter.get("/products.alt", ViewsController.getProductsAlternative);
viewsRouter.get("/products/:pid", ViewsController.getProduct);

/** Cart products with token*/
viewsRouter.get("/carts/:cid", ViewsController.getCart);
viewsRouter.get("/carts/:cid/products", ViewsController.getCartProducts);

/** Register ["PUBLIC"],*/
viewsRouter.get("/register", ViewsController.getRegister);
/** Login ["PUBLIC"],*/
viewsRouter.get("/login", ViewsController.getLogin);
/** Current user ["PRIVATE"] */
viewsRouter.get("/current", authToken, ViewsController.getCurrent);
/**["PUBLIC"], */
viewsRouter.get(
  "/resetPassword/:token",
  authToken,
  ViewsController.getResetPassword
);
/** Logout ["PRIVATE"] */
viewsRouter.get("/logout", authToken, ViewsController.getLogout);

//Cálculo bloqueante y cantidad de vistas (Fin de la clase 25)
viewsRouter.get("/calcNoBlocking", ViewsController.getCalcNoBlocking);
viewsRouter.get("/soldProducts", ViewsController.getSoldProducts);

module.exports = viewsRouter;
