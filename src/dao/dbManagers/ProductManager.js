const productModel = require("../models/product.js");

class ProductManager {
  async addProduct(productData) {
    return await productModel.create(productData);
  }

  async getProducts(queryParams = null) {
    let result = [];
    let opt = {};
    if (queryParams) {
      let paginationOpt = {
        page: queryParams.page || 1,
        limit: queryParams.limit || 10,
        lean: true,
      };
      if (queryParams.sort) {
        paginationOpt.sort = { price: queryParams.sort == "asc" ? 1 : -1 };
      }

      if (queryParams.query) {
        opt = this.getOptionsObject(queryParams.query);
      }
      result = await productModel.paginate(opt, paginationOpt);

      if (
        !paginationOpt.page ||
        result.totalPages < paginationOpt.page ||
        paginationOpt.page < 1
      ) {
        throw new Error("Page does not exist");
      }
    } else {
      result = await productModel.find().lean();
    }

    if (queryParams && Object.keys(queryParams).length > 0) {
      let extraLinkParams = "";
      Object.keys(queryParams).forEach((key) => {
        if (key != "page") {
          extraLinkParams += `&${key}=${queryParams[key]}`;
        }
      });

      result.prevLink = result.hasPrevPage
        ? `/products?page=${result.prevPage}${extraLinkParams}`
        : "";
      result.nextLink = result.hasNextPage
        ? `/products?page=${result.nextPage}${extraLinkParams}`
        : "";
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
          { id: new RegExp(query) },
          { description: new RegExp(query) },
          { category: new RegExp(query) },
          { title: new RegExp(query) },
          { code: new RegExp(query) },
          { stock: new RegExp(query) },
          { price: new RegExp(query) },
          { status: new RegExp(query) },
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
    return await productModel.updateOne({ _id: id }, newProduct);
  }

  async deleteProduct(id) {
    return await productModel.deleteOne({ _id: id });
  }
}

module.exports = ProductManager;
