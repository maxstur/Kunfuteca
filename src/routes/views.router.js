const { Router } = require("express");
const ProductManager = require("../dao/dbManagers/ProductManager");
const productManager = new ProductManager(
  __dirname + "/../files/products.json"
);

const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

module.exports = router;
