const { Router } = require("express");
const ProductManager = require("../dao/dbManagers/ProductManager");
const CartsManager = require("../dao/dbManagers/CartsManager");
const productManager = new ProductManager(
  __dirname + "/../files/products.json"
);
const cartsManager = new CartsManager(__dirname + "/../files/carts.json");
const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realtimeproducts", { products });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

/** views */

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

router.get("/product/:iid", async (req, res) => {
  //alternativa

  try {
    const product = await productManager.getProduct(req.params.productId);
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

module.exports = router;
