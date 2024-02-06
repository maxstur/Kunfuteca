const { Router } = require("express");
const CartsManager = require("../CartsManager");
const ProductManager = require("../ProductManager");
const router = Router();

const ProductsManager = new ProductManager(__dirname + "/../files/products.json");
const CartManagerCarrito = new CartsManager(__dirname + "/../files/carts.json");

router.post("/", async (req, res) => {
  await CartManagerCarrito.addCart();
  res.send({ status: "Carrito creado exitosamente" });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const cart = await CartManagerCarrito.getCart(id);
  if (!cart) {
    res.status(404).send("Carrito no encontrado");
  } else {
    // Obtener los productos asociados al carrito
    const products = await ProductsManager.getProductsForCart(id);
    res.send({ status: "Carrito encontrado", products: products });
  }
});

router.post("/:id/product/:pid", async (req, res) => {
  const cid = req.params.id;
  const pid = req.params.pid;
  const cart = await CartManagerCarrito.getCart(cid);
  const product = await ProductsManager.getProduct(pid);
  if (!cart) {
    res.status(400).send("Carrito no existente");
  } else if (!product) {
    res.status(404).send("Producto no encontrado");
  } else {
    await CartManagerCarrito.addProduct(cid, pid);
    res.send({ status: "Producto agregado exitosamente" });
  }
});

module.exports = router;

