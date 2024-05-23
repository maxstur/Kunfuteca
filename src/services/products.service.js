//<---persistencia con Mongoose--->
const ProductsDao = require("../dao/products.dao");

class ProductsService {
  constructor() {
    this.dao = new ProductsDao();
  }

  async getAll(queryParams = null) {
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

      result = await this.dao.getAll(opt, paginationOpt);

      if (
        !paginationOpt.page ||
        result.totalPages < paginationOpt.page ||
        paginationOpt.page < 1
      ) {
        throw { message: "Page does not exist", status: 400 };
      }
    } else {
      result = await this.dao.getAll();
    }

    let extraLinkParams = "";
    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        if (key != "page") {
          extraLinkParams += `&${key}=${queryParams[key]}`;
        }
      });
    }

    result.prevLink = result.hasPrevPage
      ? `/products?page=${result.prevPage}${extraLinkParams}`
      : "";
    result.nextLink = result.hasNextPage
      ? `/products?page=${result.nextPage}${extraLinkParams}`
      : "";

    return result;
  }

  async getById(id) {
    const product = await this.dao.getById(id);
    if (!product) throw { message: `The product ${id} does not exist`, status: 400 };
    return product;
  }

  async create(toy) {
    return await this.dao.create(toy);
  }

  async update(id, toy) {
    const found = await this.dao.getById(id);

    if (!found) {
      throw { message: `The product ${id} does not exist`, status: 400 };
    }
    return await this.dao.update(id, toy);
  }

  async delete(id) {
    const product = await this.dao.getById(id);
    if (!product) throw { message: `The product ${id} does not exist`, status: 400 };

    return await this.dao.delete(id);
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
}

module.exports = ProductsService;
