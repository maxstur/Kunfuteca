const cartModel = require("../models/cart");

class CartsManager {
  async addCart() {
    const cart = { products: [] };
    await cartModel.create(cart);
  }

  async getCart(id) {
    const cart = await cartModel.findById({ _id: id });
    return cart;
  }

  async getAllCarts() {
    const carts = await cartModel.find();
    return carts;
  }

  async addProduct(id, productId) {
    const cart = await this.getCart(id);

    const index = cart.products.findIndex((p) => p.product == productId);
    if (index >= 0) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    const serializedCart = cart.toObject(); // Convertir el documento de Mongoose a objeto JavaScript
    await cartModel.updateOne({ _id: id }, serializedCart);
  }
}

module.exports = CartsManager;
