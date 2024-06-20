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
      res.status(500).send({ error: "Error al obtener los productos" });
    }
  }

  static async getRealTimeProducts(req, res) {
    try {
      const products = await productManager.getProducts();
      res.render("realTimeProducts", { products });
    } catch (error) {
      res.status(500).send({ error: "Error al obtener los productos" });
    }
  }

  static async getChat(req, res) {
    res.render("chat", {});
  }

  /** Products with Token user: req.TokenUser, ["PUBLIC"],*/
  static async getProducts(req, res) {
    try {
      const { docs, ...rest } = await productManager.getProducts(req.query);

      res.render("products", { products: docs, ...rest });
    } catch (error) {
      res.send({ status: "error", error: error.message });
    }
  }

  static async getProductsAlternative(req, res) {
    try {
      const { docs, ...rest } = await productManager.getProducts(req.query);
      res.render("products_alternative", { products: docs, ...rest });
    } catch (error) {
      res.send({ status: "error", error: error.message });
    }
  }

  static async getProduct(req, res) {
    try {
      const product = await productManager.getProduct(req.params.pid);
      res.render("product", { product: product });
    } catch (error) {
      res.send({ status: "error", error: error.message });
    }
  }

  static async getCart(req, res) {
    try {
      const cart = await cartsManager.getCart(req.params.cid); // O quizás: productManager
      res.render("cart", cart);
    } catch (error) {
      res.send({ status: "error", error: error.message });
    }
  }

  static async getCartProducts(req, res) {
    try {
      const { docs, ...rest } = await productManager.getProducts();
      res.render("cartProducts", { products: docs, ...rest });
    } catch (error) {
      res.send({ status: "error", error: error.message });
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
      const user = await userModel.findOne({ _id: req.user._id }).lean();
      res.render("current", user );
    } else {
      res.send({ status: "error", error: "User not authenticated" });
    }
  }

  static async getResetPassword(req, res) {
    res.render("resetPassword", { token: req.params.token });
  }

  static async getLogout(req, res) {
    req.logout((err) => {
      if (err) {
        return res.status(500).send({ status: "error", error: err });
      }

      res.clearCookie("rodsCookie");
      res.redirect("/login");

      res.send({ status: "success", message: "User logged out successfully" });
    });
  }

  static async getCalcNoBlocking(req, res) {
    // Llamada Cálculo no bloqueante
    const child = fork(`${__dirname}/../child.js`);
    // result de  = operacionCompleja; (fork es para crear un proceso secundario)
    child.send("Start calculating");
    child.on("message", (result) => {
      console.log("Listening message from child", result);
      res.send({ result });
    });
  }

  static async getSoldProducts(req, res) {
    // Llamada Cálculo bloqueante
    // result de  = operacionCompleja; (fork es para crear un proceso secundario)
    const result = soldProducts();
    res.send({ result });
  }
}

module.exports = ViewsController;
