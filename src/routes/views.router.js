const { Router } = require("express");
const CartsManager = require("../dao/dbManagers/CartsManager");
const ProductManager = require("../dao/dbManagers/ProductManager");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils");


const cartsManager = new CartsManager(__dirname + "/../files/carts.json");
const productManager = new ProductManager(
  __dirname + "/../files/products.json"
);

const viewsRouter = Router();

/** views */

viewsRouter.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products: products });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realtimeproducts", { products: products });
});

viewsRouter.get("/chat", (req, res) => {
  res.render("chat", {});
});

viewsRouter.get("/products", async (req, res) => {
  try {
    const { docs, ...rest } = await productManager.getProducts(req.query);
    res.render("products", { products: docs, ...rest });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
});

/** alternative */
viewsRouter.get("/products.alt", async (req, res) => {
  //alternativa

  try {
    const { docs, ...rest } = await productManager.getProducts(req.query);
    res.render("products_alternative", { products: docs, ...rest });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
});

viewsRouter.get("/products/:pid", async (req, res) => {
  //alternativa

  try {
    const product = await productManager.getProduct(req.params.pid);
    res.render("product", { product: product });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
});
/** ----------------- */

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartsManager.getCart(req.params.cid);
    res.render("cart", cart);
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
});

/** Middlewares */
const publicAccess = (req, res, next) => {
  next();
};

const privateAccess = (req, res, next) => {
  next();
};

/** Register */

viewsRouter.get("/register", publicAccess, (req, res) => {
  res.render("register", {});
});

/** Login */

viewsRouter.get("/login", publicAccess, (req, res) => {
  res.render("login");
});

viewsRouter.get("/resetPassword", (req, res) => {
  res.render("resetPassword", {});
});

viewsRouter.get("/current", privateAccess, (req, res) => {
  res.render("current", {
    user: req.user,
    message: "Logged in successfully",
  });
})



module.exports = { viewsRouter };
