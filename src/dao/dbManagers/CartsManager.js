const cartModel = require("../models/cart");

class CartsManager {
  async addCart() {
    await CartModel.create({ products: [] });
  }

  async getAllCarts() {
    const carts = await CartModel.find();
    return carts;
  }

  async getCart(id) {
    const cart = await CartModel.findById(id);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    return cart;
  }

  async addProduct(cid, productId) {
    const cart = await this.getCart(cid);

    const productIndex = cart.products.findIndex((p) => p.product == productId);
    if (productIndex >= 0) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cartModel.updateOne({ _id: cid }, cart);
  }

  async deleteProduct(cid, pid) {
    const cart = await this.getCart(cid);
    cart.products = cart.products.filter((p) => p.product !== pid);
    await cart.save();
    return cart;
  }
}

module.exports = CartsManager;
