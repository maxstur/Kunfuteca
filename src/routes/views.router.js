const { Router } = require("express");
const ProductManager = require("../ProductManager");
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

module.exports = router;
