const { Router } = require("express");
const CartsManager = require("../CartsManager");
const ProductManager = require("../ProductManager");
const router = Router();

const CartManager = new CartsManager(__dirname + "/../files/carts.json");
const ProductsManager = new ProductManager(
  __dirname + "/../files/products.json"
);

router.post("/", async (req, res) => {
  try {
    await CartManager.addCart();
    res.send({ status: "Carrito creado exitosamente" });
  } catch (error) {
    res.status(500).send({ error: "Error al crear carrito" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cart = await CartManager.getCart(id);
    if (!cart) {
      res.status(404).send({ error: "Carrito no encontrado" });
    } else {
      const cart = await CartManager.getCart(id);
      res.send({ status: "Carrito encontrado", products: cart.products });
    }
  } catch (error) {
    res.status(500).send({ error: "Error al obtener carrito" });
  }
});

router.post("/:id/product/:pid", async (req, res) => {
  try {
    const cid = req.params.id;
    const pid = req.params.pid;
    const cart = await CartManager.getCart(cid);
    const product = await ProductsManager.getProduct(pid);
    if (!cart) {
      res.status(400).send({ error: "Carrito no existente" });
    } else if (!product) {
      res.status(404).send({ error: "Producto no encontrado" });
    } else {
      CartManager.addProduct(cid, pid);
      res.send({ status: "Producto agregado exitosamente" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error al agregar producto al carrito" });
  }
});

module.exports = router;
