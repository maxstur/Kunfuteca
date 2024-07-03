const { fork } = require("child_process");
const { soldProducts } = require("../utils");

const ProductsService = require("../services/products.service");
const CartsService = require("../services/carts.service");

const productsService = new ProductsService();
const cartsService = new CartsService();

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
      res.render("chat", {});
    } catch (error) {
      res.sendServerError({ error: "Chat doesn't exist" });
    }
  }

  static async getProducts(req, res) {
    try {
      const {
        products: foundProducts,
        ...rest
      } = await productsService.getProducts(req.query || {});

      if (!foundProducts) {
        throw new Error("Products not found");
      }

      const renderedData = {
        products: foundProducts,
        style: "products.css",
        ...rest,
      };

      res.render("products", renderedData);
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      res.sendServerError({ error: errorMessage });
    }
  }

  static async getProductsAlternative(req, res) {
    try {
      const { docs, ...rest } = await productsService.getAll(req.query);
      res.render("products_alternative", { products: docs, ...rest });
    } catch (error) {
      res.sendServerError({
        error: "Error al obtener los productos alternativos",
      });
    }
  }

  static async getProductById(req, res) {
    try {
      const product = await productsService.getAll(req.params.pid);
      res.render("product", { product: product });
    } catch (error) {
      res.sendServerError({ error: "Product by id doesn't exist" });
    }
  }

  static async getCartById(req, res) {
    try {
      const cart = await cartsService.getById(req.params.cid); // O quizás: productManager
      res.render("cart", { ...cart, style: "products.css" });
    } catch (error) {
      res.sendServerError({ error: "Cart by id doesn't exist" });
    }
  }

  static async getCartProducts(req, res) {
    try {
      const { docs, ...rest } = await productManager.getProducts();
      res.render("cartProducts", { products: docs, ...rest });
    } catch (error) {
      res.sendServerError({
        error: "There was an error in the cart products route",
      });
    }
  }

  /** Register - Login - Current - Logout - More */
  static async getRegister(req, res) {
    try {
      res.render("register", {});
    } catch (error) {
      res.sendServerError({ error: error.message });
    }
  }

  static async getLogin(req, res) {
    try {
      res.render("login", {});
    } catch (error) {
      res.sendServerError({ error: error.message });
    }
  }

  static async getCurrent(req, res) {
    if (req.user) {
      try {
        const user = await userModel.findOne({ _id: req.user._id }).lean();
        res.render("current", user);
      } catch (error) {
        res.sendUserError({ error: "There was a problem getting the user" });
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
