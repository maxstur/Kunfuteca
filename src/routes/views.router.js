const { Router } = require("express");
const ViewsController = require("../controllers/views.controller");
const { validateToken} = require("../utils");
const passport = require("passport");

const viewsRouter = Router();

viewsRouter.get("/", ViewsController.getProductsHome);
viewsRouter.get("/realtimeproducts", ViewsController.getRealTimeProducts);
viewsRouter.get("/chat", ViewsController.getChat);
viewsRouter.get("/calcNoBlocking", ViewsController.getCalcNoBlocking);
viewsRouter.get("/soldProducts", ViewsController.getSoldProducts);
viewsRouter.get("/register", ViewsController.getRegister);
viewsRouter.get("/register-fail", ViewsController.getRegisterError);
viewsRouter.get("/login", ViewsController.getLogin);
viewsRouter.get("/login-success", ViewsController.getLoginSuccess);
viewsRouter.get("/login-fail", ViewsController.getLoginError);
// viewsRouter.get("/github", ViewsController.getGithub);
// viewsRouter.get("/githubcallback", ViewsController.getGithubCallback);

viewsRouter.get("*", ViewsController.get404);

/** products with token */
viewsRouter.get("/products", passport.authenticate("jwt", { session: false }), ViewsController.getProducts);
viewsRouter.get("/products.alt", ViewsController.getProductsAlternative);
viewsRouter.get("/products/:pid", ViewsController.getProductById);

/** Carts with token */
viewsRouter.get("/carts/:cid", ViewsController.getCartById);
viewsRouter.get("/carts/:cid/products", ViewsController.getCartProducts);

/** Current user ["PRIVATE"] */
viewsRouter.get(
  "/current",
  ViewsController.getCurrent
);
viewsRouter.get("/resetPassword/:token", ViewsController.getResetPassword);
viewsRouter.get("/logout", ViewsController.getLogout);

module.exports = viewsRouter;
