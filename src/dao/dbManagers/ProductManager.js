const productModel = require("../models/product");

class ProductManager {
  async addProduct(productData) {
    await productModel.create(productData);
  }

  async getProducts() {
    const products = await productModel.find().lean();
    return products;
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
