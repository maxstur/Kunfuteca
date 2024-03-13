const productModel = require("../models/product");

class ProductManager {
  async addProduct(productData) {
    await productModel.create(productData);
  }

  async getProducts(queryParams = {}) {
    let result = [];
    let opt = {};

    const { page = 1, limit = 10, sort, query } = queryParams;

    let paginationOpt = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      lean: true,
    };

    if (sort) {
      paginationOpt.sort = { price: sort == "asc" ? 1 : -1 };
    }

    if (query) {
      opt = this.getOptionsObject(query);
    }

    try {
      result = await productModel.paginate(opt, paginationOpt);

      if (
        !paginationOpt.page ||
        result.totalPages < paginationOpt.page ||
        paginationOpt.page < 1
      ) {
        throw new Error("Page does not exist");
      }

      // Construir enlaces de paginación
      const queryWithoutPage = { ...queryParams };
      delete queryWithoutPage.page;
      const queryString = new URLSearchParams(queryWithoutPage).toString();
      const baseLink = "/products";
      result.prevLink = result.hasPrevPage
        ? `${baseLink}?page=${result.prevPage}&${queryString}`
        : "";
      result.nextLink = result.hasNextPage
        ? `${baseLink}?page=${result.nextPage}&${queryString}`
        : "";
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw new Error("Error al obtener productos");
    }

    return result;
  }

  getOptionsObject(query) {
    try {
      const obj = JSON.parse(query);
      return obj;
    } catch (error) {
      const opt = {
        $or: [
          { description: new RegExp(query) },
          { category: new RegExp(query) },
        ],
      };
      return opt;
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
