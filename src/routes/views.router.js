const { Router } = require("express");
const passport = require("passport");
const CustomRouter = require("./custom.router");
const ViewsController = require("../controllers/views.controller");

const router = Router();

class ViewsRouter extends CustomRouter {
  initialize() {
    /** ["PUBLIC"]  Public Routes*/
    this.get("/", ["PUBLIC"], ViewsController.getProductsHome);
    this.get(
      "/realtimeproducts",
      ["PUBLIC"],
      ViewsController.getRealTimeProducts
    );
    this.get("/chat", ["PUBLIC"], ViewsController.getChat);
    this.get("/calcNoBlocking", ["PUBLIC"], ViewsController.getCalcNoBlocking);
    this.get("/soldProducts", ["PUBLIC"], ViewsController.getSoldProducts);
    this.get("/register", ["PUBLIC"], ViewsController.getRegister);
    this.get("/login", ["PUBLIC"], ViewsController.getLogin);

    /** products with token */
    this.get(
      "/products",
      passport.authenticate("jwt"),
      ["ADMIN", "USER"],
      ViewsController.getProducts
    );
    this.get(
      "/products.alt",
      passport.authenticate("jwt"),
      ["ADMIN", "USER"],
      ViewsController.getProductsAlternative
    );
    this.get(
      "/products/:pid",
      passport.authenticate("jwt"), ["ADMIN", "USER"],
      ViewsController.getProduct
    );

    /** Carts with token */
    this.get(
      "/carts/:cid",
      passport.authenticate("jwt"), ["ADMIN", "USER"],
      ViewsController.getCart
    );
    this.get(
      "/carts/:cid/products",
      passport.authenticate("jwt"), ["ADMIN", "USER"],
      ViewsController.getCartProducts
    );

    /** Current user ["PRIVATE"] */
    this.get(
      "/current",
      passport.authenticate("jwt"), ["ADMIN", "USER"],
      ViewsController.getCurrent
    );
    this.get(
      "/resetPassword/:token",
      passport.authenticate("jwt"), ["ADMIN", "USER"],
      ViewsController.getResetPassword
    );
    this.get(
      "/logout",
      passport.authenticate("jwt"), ["ADMIN", "USER"],
      ViewsController.getLogout
    );
  }

  /** De ex USER ROUTER */
  // this.post("/premium-router", ["PREMIUM", "ADMIN"], (req, res) => {
  //   const { first_name, email } = req.user;
  //   if (!first_name || !email) {
  //     return res.sendUserError(
  //       `The fields "first_name" and "email" are required`)}

  //   res.sendSuccess("Account validated successfully");
  // });
  // this.get("/only-admins", ["USER"], (req, res) => {
  //   if (req.user.role !== "ADMIN") {
  //     return res.sendUserError("Only admins can access this route");
  //   }
  //   res.sendSuccess("Dear Admin, you have reached UserRouter");
  // });
  // this.get("/simulate-server-error", ["PUBLIC"], (req, res) => {
  //   // Simulamos un error del servidor
  //   res.sendServerError("Sorry something went wrong, try again later");
  // });
  // this.get("/custom-accounts", ["ADMIN"], (req, res) => {
  //   res.sendSuccess("Dear Admin, you have reached UserRouter");
  // });
  // this.get("/premium-members", ["PREMIUM", "ADMIN"], (req, res) => {
  // //   const { first_name, email, membership } = req.user;

  // //   if (!first_name || !email || !membership) {
  // //     return res.sendUserError(
  // //       `The fields "first_name", "email" and "membership" are required`
  // //     );
  // //   }
  //   res.sendSuccess("Welcome, premium member!");
  // });
}

module.exports = ViewsRouter;
