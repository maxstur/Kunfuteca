const { Router } = require("express");
const ProductManager = require("../dao/dbManagers/ProductManager");
const router = Router();
const productManager = new ProductManager(
  __dirname + "/../files/products.json"
);

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    console.log("Datos del producto recibidos:", newProduct);
    await productManager.addProduct(newProduct);

    const products = await productManager.getProducts();
    req.io.emit('lista actualizada', {products: products});

    res.redirect("/realtimeproducts");
  } catch (error) {
    console.error("Error al agregar nuevo elemento:", error);
    res.status(500).send({ error: "Error al agregar nuevo elemento" });
  }
});

router.get("/", async (req, res) => {
  try {
    let products = await productManager.getProducts();

    const { limit } = req.query;
    if (limit) {
      products = products.slice(0, limit);
    }
    res.send({ products: products });
  } catch (error) {
    res.status(500).send({ error: "Error al obtener productos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productManager.getProduct(id);

    if (product) {
      res.send({ product });
    } else {
      res.status(404).send({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).send({ error: "Error al obtener producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    await productManager.updateProduct(id, req.body);
    res.send({ status: "Elemento actualizado" });
  } catch (error) {
    res.status(500).send({ error: "Error al actualizar producto" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await productManager.deleteProduct(id);
    res.send({ status: "Elemento eliminado" });
  } catch (error) {
    res.status(500).send({ error: "Error al eliminar producto" });
  }
});

module.exports = router;
