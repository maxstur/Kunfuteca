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

    product.id = ++ProductManager.id;
    products.push(product);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
  }

  async getProducts(limit = 10, page = 1, sort, query) {
    const content = await fs.promises.readFile(this.path, "utf-8"); //leemos archivo
    const products = JSON.parse(content); //convertimos archivo en objeto javascript

    return products;
  }

  async getProduct(id) {
    const content = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(content);
    const product = products.find((p) => p.id == id);
    return product;
  }

  async getProductsFromFile() {
    const content = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(content);
    return products;
  }

  async updateProduct(id, newProduct) {
    const products = await this.getProductsFromFile();
    const index = products.findIndex((p) => p.id == id);
    products[index] = { ...products[index], ...newProduct };
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
  }

  async deleteProduct(id) {
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      let products = JSON.parse(content);
      products = products.filter((p) => p.id != id);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
    } catch (error) {
      console.error("Error al borrar producto/s", error);
    }
  }
}

module.exports = ProductManager;
