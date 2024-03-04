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

    if (!cart) {
      throw new Error("Carrito no encontrado");
    } else {
      return cart;
    }
  }

  async addProduct(id, productId) {
    const content = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(content);

    const cartIndex = carts.findIndex((p) => p.id == id);
    const cart = { ...carts[cartIndex] };

    const index = cart.product.findIndex((p) => p.product == productId);
    if (index >= 0) {
      cart.product[index].quantity += 1;
    } else {
      cart.product.push({ product: productId, quantity: 1 });
    }

    carts[cartIndex] = cart;
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
  }
}

module.exports = CartsManager;
