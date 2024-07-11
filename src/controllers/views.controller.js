const cartsService = require("../repositories/index").cartsService;
const productsService = require("../repositories/index").productsService;


//Cálculo bloqueante y cantidad de vistas (Fin de la clase 25)
let visitorsCounter = 0;

class ViewsController {
  static async getProductsHome(req, res) {
    visitorsCounter++;
    console.log(
      `Hello visitors, this web has been visited: ${visitorsCounter}`
    );
    try {
      const products = await productsService.getAll();
      res.render("home", { products });
    } catch (error) {
      res.sendServerError({ error: "Home products don't exist" });
    }
  }

  static async getRealTimeProducts(req, res) {
    try {
      const products = await productsService.getAll();
      res.render("realTimeProducts", { products });
    } catch (error) {
      res.sendServerError({ error: "Live products don't exist" });
    }
  }

  static async getChat(req, res) {
    try {
      res.render("chat", {user: req.user});
    } catch (error) {
      res.send({ status: "error", error: "Chat doesn't exist" });
    }
  }

  static async getProducts(req, res) {
    try {
      const { docs,...rest } = await productsService.getAll(req.query);
      const cart = await cartsService.getById(req.user.cartId);
      res.render("products", { products: docs, style: "products.css", user: req.user, cart, ...rest });
    } catch (error) {
      res.status( errror.status || 500).send({ status: "error", error: "Products don't exist" });
    }
  }

  static async getProductsAlternative(req, res) {
    try {
      const { docs, ...rest } = await productsService.getAll(req.query);
      res.render("products_alternative", { products: docs, ...rest });
    } catch (error) {
      res.send({
        status: "error",
        error: "Error al obtener los productos alternativos",
      });
    }
  }

  static async getProductById(req, res) {
    try {
      const product = await productsService.getAll(req.params.pid);
      res.render("product", { product: product });
    } catch (error) {
      res.send({ status: "error", error: "Product by id doesn't exist" });
    }
  }

  static async getCartById(req, res) {
    try {
      const cart = await cartsService.getById(req.params.cid); // O quizás: productManager
      res.render("cart", { ...cart, style: "products.css" });
    } catch (error) {
      res.send({ status: "error", error: "Cart by id doesn't exist" });
    }
  }

  static async getCartProducts(req, res) {
    try {
      const { docs, ...rest } = await productManager.getProducts();
      res.render("cartProducts", { products: docs, ...rest });
    } catch (error) {
      res.send({ status: "error", error: "Cart products don't exist" });
    }
  }

  /** Register - Login - Current - Logout - More */
  static async getRegister(req, res) {
    res.render("register", {});
  }

  static async getRegisterError(req, res) {
    res.status(400).send({
      status: "error",
      error: "User already exists",
      alert: "User already exists, please login",
    });
  }

  static async getLogin(req, res) {
    res.render("login", {});
  }

  static async getLoginError(req, res) {
    res.status(401).send({
      status: "error",
      error: "Invalid credentials",
      alert: "Invalid credentials, please try again",
    });
  }

  static async getLoginSuccess(req, res) {
    res.status(200).send({
      status: "success",
      message: "User logged in successfully",
      payload: {
        user: req.user}
    });
  }

  static async getProfile(req, res) {
    try{
      res.render("profile", {user: {}});
    } catch (error) {
      res.status(error.status || 500).send({ status: "error", error: "Profile doesn't exist" });
    }
  }

  static async getResetPassword(req, res) {
    if (!req.token) {
      return res.send({ error: "Invalid token" });
    }
    res.render("resetPassword", { token: req.token });

    res.status(200).send({ message: "Reset password form", alert: "Your password has been reset" });
  }

  static async getLogout(req, res) {
    req.logout((err) => {
      if (err) {
        return res.sendServerError({ error: "Failed to log out" });
      }
      res.clearCookie("rodsCookie");
      start;
      res.redirect("/login");

      res.sendUserSuccess({ message: "User logged out successfully" });
    });
  }

  static async getCalcNoBlocking(req, res) {
    // Llamada Cálculo no bloqueante
    const child = fork(`${__dirname}/../child.js`);
    // result de  = operacionCompleja; (fork es para crear un proceso secundario)
    child.send("Start calculating");
    child.on("message", (result) => {
      console.log("Listening message from child", result);
      res.sendServerSuccess({ result });
    });
  }

  static async getSoldProducts(req, res) {
    // Llamada Cálculo bloqueante
    // result de  = operacionCompleja; (fork es para crear un proceso secundario)
    const result = soldProducts();
    res.sendServerSuccess({ result });
  }
  static get404(req, res) {
    if (!req.path) {
      return res.send({
        status: "error",
        message: "404 content not found, path is required",
      });
    }
    return res.send({
      status: "error",
      message: `404 content not found, there is no route specified for ${req.path}`,
    });
  }
}

module.exports = ViewsController;
