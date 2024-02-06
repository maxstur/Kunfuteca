const fs = require("fs");

class CartsManager {
  constructor(filePath) {
    this.path = filePath;
    this.id = 0;
    fs.writeFileSync(filePath, "[]");
  }

  async addCart() {
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(content);
  
      const cart = { id: ++this.id, items: [] };
  
      carts.push(cart);
  
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    } catch (error) {
      console.error("Error adding cart:", error);
    }
  }

  async getCart(id) {
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(content);
  
      const cart = carts.find((i) => i.id == id);
  
      return cart;
    } catch (error) {
      console.error("Error getting cart:", error);
      return null;
    }
  }

  async addProduct(id, productId) {
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(content);
  
      let cartIndex = carts.findIndex((i) => i.id == id);
      if (cartIndex >= 0) {
        const cart = carts[cartIndex];
        const productIndex = cart.items.findIndex((i) => i.item == productId);
        if (productIndex >= 0) {
          cart.items[productIndex].quantity += 1;
        } else {
          cart.items.push({ item: productId, quantity: 1 });
        }
        carts[cartIndex] = cart;
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }
}

module.exports = CartsManager;

