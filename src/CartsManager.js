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
      const cart = { id: ++CartsManager.id, products: [] };

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

      const cart = carts.find(i => i.id == id);

      return cart;
    } catch (error) {
      console.error("Error getting cart:", error);
      return null;
    }
  }

  async addProduct(id, productId) {
      const content = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(content);
      const cartIndex = carts.findIndex(i => i.id == id);
      const cart = {...carts[cartIndex]};

      const index = cart.products.findIndex(i => i.item == productId);
        if (productIndex >= 0) {
          // Si el producto ya existe, aumentar la cantidad
          cart.items[productIndex].quantity += 1;
        } else {
          // Si el producto no existe, agregarlo al carrito con cantidad 1
          cart.items.push({ item: productId, quantity: 1 });
        }
        carts[cartIndex] = cart;

        // Escribir la matriz actualizada de carritos en el archivo
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(carts, null, "\t")
        );
        
  }
}

module.exports = CartsManager;
