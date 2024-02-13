const fs = require("fs");

class ProductManager {
  static id = 0;
  constructor(filePath) {
    this.path = filePath;
    fs.writeFileSync(filePath, "[]");
  }

  async addProduct(productData) {
    try {
      // Validar que todos los campos obligatorios estén presentes
      if (
        !productData.title ||
        !productData.description ||
        !productData.code ||
        !productData.price ||
        !productData.stock ||
        !productData.category
      ) {
        throw new Error(
          "Todos los campos obligatorios deben ser proporcionados"
        );
      }

      // Verificar que thumbnails sea un array de strings o proporcionar un array de rutas de ejemplo
      const thumbnails = Array.isArray(productData.thumbnails)
        ? productData.thumbnails
        : ["foto_1", "foto_2", "foto_3", "foto_4", "foto_5"];
      if (!thumbnails.every((item) => typeof item === "string")) {
        throw new Error("thumbnails debe ser un array de strings");
      }

      const content = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(content);

      const newProduct = {
        id: ++ProductManager.id,
        title: productData.title,
        description: productData.description,
        code: productData.code,
        price: productData.price,
        stock: productData.stock,
        category: productData.category || "",
        thumbnails: productData.thumbnails,
        status: productData.status || true,
      };

      // Agregar el nuevo producto al arreglo de productos
      products.push(newProduct);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );

      return { status: "Elemento agregado exitosamente" };
    } catch (error) {
      console.error("Error al agregar producto:", error);
      throw new Error("Error al agregar producto");
    }
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
  // Ej cómo ahorrar código
  async getProductsFromFile() {
    const content = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(content);
    return products;
  }

  async updateProduct(id, newProduct) {
    let products = await this.getProductsFromFile();
    let index = products.findIndex((p) => p.id == id);
    if (index >= 0) {
      products[index] = { ...newProduct, id: products[index].id };
    }
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
    return products[index];
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
