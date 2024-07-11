const { Router } = require("express");
const ViewsController = require("../controllers/views.controller");
const getToken = require("../middlewares/getToken.middleware");
const passport = require("passport");
const checkRole = require("../middlewares.js/checkRole.middleware");

const viewsRouter = Router();

viewsRouter.get("/", ViewsController.getProductsHome);
viewsRouter.get("/realtimeproducts", ViewsController.getRealTimeProducts);
viewsRouter.get("/chat", getToken, checkRole("USER"), ViewsController.getChat);
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
viewsRouter.get("/products", getToken, ViewsController.getProducts);
viewsRouter.get("/products.alt", ViewsController.getProductsAlternative);
viewsRouter.get("/products/:pid", ViewsController.getProductById);

/** Carts with token */
viewsRouter.get("/carts/:cid", ViewsController.getCartById);
viewsRouter.get("/carts/:cid/products", ViewsController.getCartProducts);

/** Current user ["PRIVATE"] */
viewsRouter.get(
  "/current", getToken, passport.authenticate("jwt", { session: false }),
  ViewsController.getCurrent
);
viewsRouter.get("/resetPassword", getToken, passport.authenticate("jwt", { session: false }), ViewsController.getResetPassword);
viewsRouter.get("/logout", ViewsController.getLogout);

module.exports = viewsRouter;
