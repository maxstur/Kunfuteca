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
    req.io.emit("Lista actualizada", { products: products });

    res.redirect("/realtimeproducts");
  } catch (error) {
    console.error("Error al agregar nuevo elemento:", error);
    res.status(500).send({ error: "Error al agregar nuevo elemento" });
  }
});

router.get("/", async (req, res) => {
  let query = req.query;
  try {
    let { docs, ...rest } = await manager.getProducts(query);
    res.send({ status: "success", payload: docs, ...rest });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let product = await productManager.getProduct(req.params.id);
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
  res.send({ product: product });
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
