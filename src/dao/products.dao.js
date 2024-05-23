const productModel = require("../models/product.js");


/** El DAO sólo se encarga de la persistencia, no de la lógica. */
/** O sea el DAO no interactua con la base de datos */
/** Solo se encarga de las operaciones CRUD */
class ProductsDao {
  async getAll(opt, paginationOpt) {
    if (opt && paginationOpt) {
      return await productModel.paginate(opt, paginationOpt);
    }

    return await productModel.find().lean();
  }

  async getById(id) {
    return await productModel.findOne({ _id: id }).lean();
  }

  async create(product) {
    return await productModel.create(product);
  }

  async update(id, product) {
    return await productModel.updateOne({ _id: id }, product);
  }

  async delete(id) {
    return await productModel.deleteOne({ _id: id });
  }
}

module.exports = ProductsDao;
