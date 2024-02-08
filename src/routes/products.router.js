const { Router } = require("express");
const ProductManager = require("../ProductManager");
const router = Router();
const manager = new ProductManager(__dirname + "/../files/products.json");

router.get("/", async (req, res) => {
  try {
    let products = await manager.getProducts();

    const { limit } = req.query;
    if (limit) {
      products = products.slice(0, limit)}

    res.send({ products: products });
  } catch (error) {
    res.status(500).send({ error: "Error al obtener productos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let products = await manager.getProducts();
    let id = req.params.id;

    let product = products.find(p => p.id == id);
    res.send({ product: product });
  } catch (error) {
    res.status(500).send({ error: "Error al obtener producto por ID" });
  }
});

router.post("/", async (req, res) => {
  try {
    await manager.addProduct(req.body);
    res.send({ status: "Elemento agregado" });
  } catch (error) {
    res.status(500).send({ error: "Error al agregar producto" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    await manager.updateProduct(id, req.body); // Añadir el ID al producto
    res.send({ status: "Elemento actualizado" });
  } catch (error) {
    res.status(500).send({ error: "Error al actualizar producto" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await manager.deleteProduct(id);
    res.send({ status: "Elemento eliminado" });
  } catch (error) {
    res.status(500).send({ error: "Error al eliminar producto" });
  }
});

// Carga inicial de productos
async function addProducts() {
      await manager.addProduct({description:"item 1"})
      await manager.addProduct({description:"item 2"})
}
addProducts();

module.exports = router;
