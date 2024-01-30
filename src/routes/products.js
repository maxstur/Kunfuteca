const express = require("express");
const fs = require("fs");
const path = require("path");

const productsRouter = express.Router();
const productsFilePath = path.join(__dirname, "../../products.json");

// Función para generar IDs únicos
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

productsRouter.get("/", (req, res) => {
  // Implementa la limitación opcional con ?limit
  const limit = req.query.limit;
  let productList = fs.readFileSync(productsFilePath, "utf-8");
  productList = JSON.parse(productList);

  if (limit) {
    productList = productList.slice(0, limit);
  }

  res.json(productList);
});

productsRouter.get("/:pid", (req, res) => {
  const productId = req.params.pid;
  const productList = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
  const product = productList.find((p) => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

productsRouter.post("/", (req, res) => {
  const newProduct = {
    id: generateUniqueId(),
    ...req.body,
    status: true,
  };

  const productList = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
  productList.push(newProduct);
  fs.writeFileSync(productsFilePath, JSON.stringify(productList, null, 2));

  res.status(201).json(newProduct);
});

productsRouter.put("/:pid", (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;

  const productList = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
  const index = productList.findIndex((p) => p.id === productId);

  if (index !== -1) {
    productList[index] = { ...productList[index], ...updatedProduct };
    fs.writeFileSync(productsFilePath, JSON.stringify(productList, null, 2));
    res.json(productList[index]);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

productsRouter.delete("/:pid", (req, res) => {
  const productId = req.params.pid;

  let productList = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
  productList = productList.filter((p) => p.id !== productId);

  fs.writeFileSync(productsFilePath, JSON.stringify(productList, null, 2));
  res.json({ message: "Producto eliminado exitosamente" });
});

module.exports = productsRouter; // Exporta el router
