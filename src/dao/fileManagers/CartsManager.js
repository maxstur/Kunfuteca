const fs = require("fs");

class CartsManager {
  static id = 0;
  constructor(filePath) {
    this.path = filePath;
    fs.writeFileSync(filePath, "[]");
  }

  async addCart() {
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(content);
      const newCart = { id: ++CartsManager.id, products: [] };

      carts.push(newCart);

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    } catch (error) {
      console.error("Error al agregar el carrito:", error);
      throw new Error("Error al agregar el carrito");
    }
  }

  async getAllCarts() {
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error("Error al obtener todos los carritos:", error);
      throw new Error("Error al obtener todos los carritos");
    }
  }

  async getCart(id) {
    const content = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(content);

    const cart = carts.find((c) => c.id == id);

    return cart || { error: "Carrito no encontrado" };
  }

  async addProduct(id, productId) {
    const content = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(content);

    const cartIndex = carts.findIndex((c) => c.id == id);
    if (cartIndex < 0) {
      throw new Error("Carrito no encontrado");
    }

    const cart = carts[cartIndex];
    const product = cart.products.find((p) => p.product == productId);
    if (product) {
      product.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    carts[cartIndex] = cart;
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return cart;
  }
}

module.exports = CartsManager;
