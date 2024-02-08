const fs = require("fs");

class ProductManager {
  static id = 0;
  constructor(filePath) {
    this.path = filePath;
    fs.writeFileSync(filePath, "[]");
  }

  async addProduct(product) {
    const content = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(content);
    product.Id = ++ProductManager.id;
    products.push(product);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
  }

  async getProducts() {
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(content);
      return products;
    } catch (error) {
      console.error("Error getting products:", error);
      return [];
    }
  }

  async updateProduct(id, newProduct) {
      let products = await this.getProducts();
      let index = products.findIndex(p => p.Id == id);
      products[index] = { ...products[index], id: products[index].id };
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
  }

  async deleteProduct(id) {
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      let products = JSON.parse(content);
      products = products.filter(p => p.id != id);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
}

module.exports = ProductManager;
