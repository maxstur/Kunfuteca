const cartModel = require("../models/cart");

class CartsManager {
  async addCart() {
    const Cart = { products: [] };
    await cartModel.create(Cart);
  }

  async getCart(id) {
    const cart = await cartModel.findOne({ _id: id });
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    return cart;
  }

  async getAllCarts() {
    const carts = await cartModel.find();
    return carts;
  }

  async addProduct(id, productId) {
    const cart = await this.getCart(id);

    const product = cart.products.find((p) => p.product === productId);
    if (product) {
      product.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await cartModel.updateOne({ _id: id, }, cart)
  }
}



module.exports = CartsManager;
