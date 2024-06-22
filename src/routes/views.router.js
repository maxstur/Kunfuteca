const CustomRouter = require("./custom.router");
const ViewsController = require("../controllers/views.controller");

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
    this.get("/products", ["ADMIN", "USER"], ViewsController.getProducts);
    this.get(
      "/products.alt",
      ["ADMIN", "USER"],
      ViewsController.getProductsAlternative
    );
    this.get("/products/:pid", ["ADMIN", "USER"], ViewsController.getProduct);

    /** Carts with token */
    this.get("/carts/:cid", ["ADMIN", "USER"], ViewsController.getCart);
    this.get(
      "/carts/:cid/products",
      ["ADMIN", "USER"],
      ViewsController.getCartProducts
    );

    /** Current user ["PRIVATE"] */
    this.get("/current", ["PRIVATE"], ViewsController.getCurrent);
    this.get(
      "/resetPassword/:token",
      ["USER, ADMIN, PREMIUM"],
      ViewsController.getResetPassword
    );
    this.get("/logout", ["USER, ADMIN", "PREMIUM"], ViewsController.getLogout);
  }
}

module.exports = ViewsRouter;
