const { Router } = require("express");
const CartsManager = require("../dao/dbManagers/CartsManager");
const ProductManager = require("../dao/dbManagers/ProductManager");

const cartsManager = new CartsManager(__dirname + "/../files/carts.json");
const productManager = new ProductManager(
  __dirname + "/../files/products.json"
);

const viewsRouter = Router();

const publicAccess = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/products");
  } else {
    next();
  }
};

const privateAccess = (req, res, next) => {
  if (!req.session.user) {
    console.log("Not logged in yet");
    return res.redirect("/login");
  }
  next();
};

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

viewsRouter.get("/products", privateAccess, async (req, res) => {
  try {
    const { user, docs, ...rest } = await productManager.getProducts(req.query);
    res.render("products", { user: req.session.user, products: docs, ...rest });
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

/** Register */

viewsRouter.get("/register", publicAccess, (req, res) => {
  res.render("register", {});
});

/** Login */

viewsRouter.get("/login", publicAccess, (req, res) => {
  res.render("login");
});

viewsRouter.get("/resetPassword", (req, res) => {
  res.render  ("resetPassword", {});
})
module.exports = { viewsRouter };
