const { Router } = require("express");
const ProductManager = require("../ProductManager");
const router = Router();
const manager = new ProductManager(__dirname + "/../files/products.json");

router.get("/", async (req, res) => {
  let products = await manager.getProducts();

  const { limit } = req.query;
  if (limit) {
    products = products.slice(0, limit);
  }

  res.send({ items: products });
});

router.get("/:id", async (req, res) => {
  let products = await manager.getProducts();
  let id = req.params.id;

  let product = products.find((i) => i.id == id);

  res.send({ item: product });
});

router.post("/", async (req, res) => {
  await manager.addProduct(req.body);
  res.send({ status: "Elemento agregado" });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  await manager.updateProduct(id, req.body);
  res.send({ status: "Elemento actualizado" });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await manager.deleteProduct(id);
  res.send({ status: "Elemento eliminado" });
});

//Agregamos la carga inicial de productos
async function addProducts() {
  await manager.addProduct({ description: "item 1" });
  await manager.addProduct({ description: "item 2" });
  await manager.addProduct({ description: "item 3" });
  await manager.addProduct({ description: "item 4" });
  await manager.addProduct({ description: "item 5" });
  await manager.addProduct({ description: "item 6" });
  await manager.addProduct({ description: "item 7" });
}
addProducts();

module.exports = router;
