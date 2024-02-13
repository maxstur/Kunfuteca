const { Router } = require("express");
const CartsManager = require("../CartsManager");
const ProductManager = require("../ProductManager");
const router = Router();

const cartsManager = new CartsManager(__dirname + "/../files/carts.json");
const productManager = new ProductManager(
  __dirname + "/../files/products.json"
);

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
    const allCarts = await cartsManager.getAllCarts();
    res.send(allCarts);
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

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const productId = req.params.pid;

  const cart = await cartsManager.getCart(cid);
  if (!cart) {
    res.status(400).send({ message: "Carrito no encontrado" });
    return;
  }

  const product = await productManager.getProduct(productId);
  if (!product) {
    res.status(400).send({ message: "Producto no encontrado" });
    return;
  }

  await cartsManager.addProduct(cid, productId);
  res.send({ status: "Producto agregado al carrito" });
});

module.exports = router;
