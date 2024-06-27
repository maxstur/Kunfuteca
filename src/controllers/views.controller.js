const ProductManager = require("../dao/dbManagers/ProductManager");
const productManager = new ProductManager();
const { fork } = require("child_process");
const { soldProducts } = require("../utils");
const CartsManager = require("../dao/dbManagers/CartsManager");
const userModel = require("../dao/models/users");
const cartsManager = new CartsManager();


//Cálculo bloqueante y cantidad de vistas (Fin de la clase 25)
let visitorsCounter = 0;

class ViewsController {
  static async getProductsHome(req, res) {
    try {
      visitorsCounter++;
      console.log(
        `Hello visitors, this web has been visited: ${visitorsCounter}`
      );
      const products = await productManager.getProducts();
      res.render("realTimeProducts", { products });
    } catch (error) {
      res.sendServerError({ error: "Error al obtener los productos" });
    }
  }

  static async getRealTimeProducts(req, res) {
    try {
      const products = await productManager.getProducts();
      res.render("realTimeProducts", { products });
    } catch (error) {
      res.sendServerError({ error: "Error al obtener los productos" });
    }
  }

  static async getChat(req, res) {
    res.render("chat", {});
  }

  /** Products with Token user: req.TokenUser, ["PUBLIC"],*/
  static async getProducts(req, res) {
    try {
      const { docs, ...rest } = await productManager.getProducts(req.query);

      res.render("products", { products: docs, user: req.TokenUser, ...rest });
    } catch (error) {
      res.sendServerError({ error: "Error al obtener los productos" });
    }
  }

  static async getProductsAlternative(req, res) {
    try {
      const { docs, ...rest } = await productManager.getProducts(req.query);
      res.render("products_alternative", { products: docs, ...rest });
    } catch (error) {
      res.sendServerError({  error: "Error al obtener los productos alternativos" });
    }
  }

  static async getProduct(req, res) {
    try {
      const product = await productManager.getProduct(req.params.pid);
      res.render("product", { product: product });
    } catch (error) {
      res.sendServerError({  error: "Error al obtener el producto por id" });
    }
  }

  static async getCart(req, res) {
    try {
      const cart = await cartsManager.getCart(req.params.cid); // O quizás: productManager
      res.render("cart", cart);
    } catch (error) {
      res.sendServerError({ error: "Error al obtener el carrito por id" });
    }
  }

  static async getCartProducts(req, res) {
    try {
      const { docs, ...rest } = await productManager.getProducts();
      res.render("cartProducts", { products: docs, ...rest });
    } catch (error) {
      res.sendServerError({ error: "Error al obtener los productos del carrito" });
    }
  }

  /** Register - Login - Current - Logout - More */
  static async getRegister(req, res) {
    res.render("register", {});
  }

  static async getLogin(req, res) {
    res.render("login", {});
  }

  static async getCurrent(req, res) {
    if (req.user) {
      try {
      const user = await userModel.findOne({ _id: req.user._id }).lean();
      res.render("current", user);
    } catch (error) {
      res.sendUserError({ error: "Error al obtener el usuario actual" });
      }
    } else {
      res.sendUserError({ error: "User not authenticated" });
    }
  }

  static async getResetPassword(req, res) {
    if (!req.params.token) {
      return res.sendForbiddenAccess({ error: "Invalid token" });
    }
    res.render("resetPassword", { token: req.params.token });
  }

  static async getLogout(req, res) {
    req.logout((err) => {
      if (err) {
        return res.sendServerError({ error: "Failed to log out" });
      }
      res.clearCookie("rodsCookie");start
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
}

module.exports = ViewsController;
