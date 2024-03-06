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
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      let products = JSON.parse(content);

      // Aplicar limit y offset para la paginación
      products = products.slice((page - 1) * limit, page * limit);

      // Aplicar filtros por query
      if (query) {
        products = products.filter((product) =>
          product.title.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Ordenamiento
      if (sort) {
        products.sort((a, b) => {
          return sort === "desc" ? b.price - a.price : a.price - b.price;
        });
      }

      // Paginación
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const totalProducts = products.length;
      const totalPages = Math.ceil(totalProducts / limit);
      const results = products.slice(startIndex, endIndex);

      return {
        status: "success",
        payload: results,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink:
          page > 1
            ? `/api/products?limit=${limit}&page=${
                page - 1
              }&sort=${sort}&query=${query}`
            : null,
        nextLink:
          page < totalPages
            ? `/api/products?limit=${limit}&page=${
                page + 1
              }&sort=${sort}&query=${query}`
            : null,
      };
    } catch (error) {
      console.error("Error al obtener productos", error);
      return {
        status: "error",
        message: "Error al obtener productos",
      };
    }
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
