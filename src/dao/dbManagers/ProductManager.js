const productModel = require("../models/product");

class ProductManager {
  async addProduct(productData) {
    await productModel.create(productData);
  }

  async getProducts({ limit = 10, page = 1, sort, query }) {
    try {
      let queryOptions = {};

      // Aplicar filtros según los parámetros de la consulta
      if (query) {
        queryOptions = {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        };
      }

      // Ordenamiento
      if (sort) {
        queryOptions.sort = { price: sort === "asc" ? 1 : -1 };
      }

      // Paginación con el plugin de mongoose-paginate-v2
      const products = await productModel.paginate(queryOptions, {
        limit,
        page,
      });

      return {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage || null,
        nextPage: products.nextPage || null,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
          : null,
        nextLink: products.hasNextPage
          ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
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
    const products = await productModel.find({ _id: id }).lean();
    return products[0];
  }

  async updateProduct(id, newProduct) {
    await productModel.updateOne({ _id: id }, newProduct);
  }

  async deleteProduct(id) {
    await productModel.deleteOne({ _id: id });
  }
}

module.exports = ProductManager;
