const { Router } = require("express");
const CartsManager = require("../dao/dbManagers/CartsManager");
const ProductManager = require("../dao/dbManagers/ProductManager");
const router = Router();

const productManager = new ProductManager(
  __dirname + "/../files/products.json"
);
const cartsManager = new CartsManager(__dirname + "/../files/carts.json");

router.post("/", async (req, res) => {
  try {
    await cartsManager.addCart();
    res.send({ status: "Carrito creado exitosamente" });
  } catch (error) {
    res.status(500).send({ error: "Error al crear carrito" });
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartsManager.getAllCarts();
    res.send({ carts });
  } catch (error) {
    res.status(500).send({ error: "Error al obtener todos los carritos" });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const cart = await cartsManager.getCart(id);
    res.send(cart);
  } catch (error) {
    res.status(500).send({ error: "Error al obtener carrito" });
  }
});

router.post("/:id/product/:pid", async (req, res) => {
  const id = req.params.id;
  const productId = req.params.pid;

  const cart = await cartsManager.getCart(id);
  const product = await productManager.getProduct(productId);
  if (!cart) {
    res.status(400).send({ message: "Carrito no encontrado" });
    return;
  }
  if (!product) {
    res.status(400).send({ message: "Producto no encontrado" });
    return;
  }

  await cartsManager.addProduct(id, productId);
  
  res.send({ status: "Producto agregado al carrito" });
});

router.delete("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    const cart = await cartsManager.getCart(cid);
    if (!cart) {
      res.status(400).send({ message: "Carrito no encontrado" });
      return;
    }
    await cartsManager.deleteProduct(cid, pid);
    res.send({ status: "Elemento eliminado del carrito" });
  } catch (error) {
    res.status(500).send({ error: "Error al eliminar elemento del carrito" });
  }
});

module.exports = router;
