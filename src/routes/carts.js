// routes/carts.js

const express = require("express");
const fs = require("fs");
const path = require("path");

const cartsRouter = express.Router();
const cartsFilePath = path.join(__dirname, "../../carts.json");

cartsRouter.post("/", (req, res) => {
  const newCart = {
    id: generateUniqueId(),
    products: [],
  };

  const cartList = JSON.parse(fs.readFileSync(cartsFilePath, "utf-8"));
  cartList.push(newCart);
  fs.writeFileSync(cartsFilePath, JSON.stringify(cartList, null, 2));

  res.status(201).json(newCart);
});

cartsRouter.get("/:cid", (req, res) => {
  const cartId = req.params.cid;
  const cartList = JSON.parse(fs.readFileSync(cartsFilePath, "utf-8"));
  const cart = cartList.find((c) => c.id === cartId);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  let cartList = JSON.parse(fs.readFileSync(cartsFilePath, "utf-8"));
  const cartIndex = cartList.findIndex((c) => c.id === cartId);

  if (cartIndex !== -1) {
    const existingProduct = cartList[cartIndex].products.find(
      (p) => p.id === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cartList[cartIndex].products.push({ id: productId, quantity });
    }

    fs.writeFileSync(cartsFilePath, JSON.stringify(cartList, null, 2));
    res
      .status(201)
      .json({ message: "Producto agregado al carrito correctamente" });
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

// Función para generar IDs únicos
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

cartsRouter.get("/", (req, res) => {
  // Lógica para obtener todos los carritos
  const cartList = JSON.parse(fs.readFileSync(cartsFilePath, "utf-8"));
  res.json(cartList);
});

module.exports = cartsRouter;
