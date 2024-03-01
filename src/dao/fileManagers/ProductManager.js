const fs = require("fs");

class ProductManager {
  static id = 0;
  constructor(filePath) {
    this.path = filePath;
    fs.writeFileSync(filePath, "[]");
  }

  async addProduct(productData) {
    const { title, description, code, price, stock, category, status } =
      productData;
    const requiredFields = [title, description, code, price, stock, category];
    if (requiredFields.some((field) => !field)) {
      throw new Error("Todos los campos son necesarios");
    }

    const fileContent = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(fileContent);
    const newProduct = {
      id: ++this.id,
      title,
      description,
      code,
      price,
      stock,
      category: category || "",
      status: status || true,
    };
    products.push(newProduct);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
    return { status: "Producto agregado exitosamente" };
  }

  async getProducts() {
    const content = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(content);
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
    if (index >= 0) {
      products[index] = { ...products[index], ...newProduct };
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return products[index];
    } else {
      throw new Error("Producto no encontrado");
    }
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
