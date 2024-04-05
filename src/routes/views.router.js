const { Router } = require("express");
const CartsManager = require("../dao/dbManagers/CartsManager");
const ProductManager = require("../dao/dbManagers/ProductManager");

const cartsManager = new CartsManager(__dirname + "/../files/carts.json");
const productManager = new ProductManager(
  __dirname + "/../files/products.json"
);

const router = Router();
const viewsRouter = router;

/** views */

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products: products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realtimeproducts", { products: products });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

router.get("/products", async (req, res) => {
  try {
    const { docs, ...rest } = await productManager.getProducts(req.query);
    res.render("products", { products: docs, ...rest });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
});

/** alternative */
router.get("/products.alt", async (req, res) => {
  //alternativa

  try {
    const { docs, ...rest } = await productManager.getProducts(req.query);
    res.render("products_alternative", { products: docs, ...rest });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
});

router.get("/products/:pid", async (req, res) => {
  //alternativa

  try {
    const product = await productManager.getProduct(req.params.pid);
    res.render("product", { product: product });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
});
/** ----------------- */

router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartsManager.getCart(req.params.cid);
    res.render("cart", cart);
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
});

/** Register */

viewsRouter.get("/register", (req, res) => {
  res.render("register", {});
});

/** Login */

viewsRouter.get("/login", (req, res) => {
  res.render("login", {});
})

viewsRouter.get("/profile", (req, res) => {
  res.send("my profile",);
})
module.exports = router;
