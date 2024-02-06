const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.id = 0;
    fs.writeFileSync(filePath, "[]");
  }

  async addProduct(product) {
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(content);
      product.Id = ++this.id;
      products.push(product);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
    } catch (error) {
      console.error("Error adding product:", error);
    }
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

  async getProductById(id) {
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(content);
      const product = products.find((p) => p.Id == id);
      return product;
    } catch (error) {
      console.error("Error getting product by id:", error);
      return null;
    }
  }

  async updateProduct(id, newProduct) {
    try {
      let products = await this.getProducts();
      let index = products.findIndex((p) => p.Id == id);
      if (index !== -1) {
        products[index] = { ...newProduct, Id: products[index].Id };
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );
      } else {
        console.error("Product not found with id:", id);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }

  async deleteProduct(id) {
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      let products = JSON.parse(content);
      products = products.filter((p) => p.Id != id);
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

