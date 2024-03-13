const cartModel = require("../models/cart");
const ProductManager = require("../dbManagers/ProductManager");

class CartsManager {
  constructor() {
    this.productManager = new ProductManager();
  }
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

    await cartModel.updateOne({ _id: id }, cart);
  }

  async deleteProductById(cartId, productId) {
    const cart = await this.getCart(cartId);
    const product = await this.productManager.getProduct(productId);

    if (!cart) {
      throw new Error(`Carrito con id ${cartId} no encontrado`);
    }

    if (!product) {
      throw new Error(`Producto con id ${productId} no encontrado`);
    }

    const newContent = cart.products.filter(
      (product) => product.product._id != productId
    );
    await cartModel.updateOne({ _id: cartId }, { products: newContent });

    return this.getCart(cartId);
  }

  async deleteAllProducts(cartId) {
    const cart = await this.getCart(cartId);
    if (!cart) {
      throw new Error(`Carrito con id ${cartId} no encontrado`);
    }
    await cartModel.updateOne({ _id: cartId }, { products: [] });
    return this.getCart(cartId);
  }

  async deleteCart(id) {
    await cartModel.deleteOne({ _id: id });
    return { status: "Carrito eliminado" }; 
  }

  async deleteAllCarts() {
    await cartModel.deleteMany();
    return { status: "Carritos eliminados" };
  }

  async updateCartProducts(cartId, content) {
    const cart = await this.getCart(cartId);
    if (!cart) {
      throw new Error(`Carrito con id ${cartId} no encontrado`);
    }
    await cartModel.updateOne({ _id: cartId }, { products: content });
    return this.getCart(cartId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await this.getCart(cartId);
    const product = await this.productManager.getProduct(productId);

    if (!cart) {
      throw new Error(`Carrito con id ${cartId} no encontrado`);
    }

    if (!product) {
      throw new Error(`Producto con id ${productId} no encontrado`);
    }

    if (quantity || isNaN(quantity) || quantity < 0) {
      throw new Error(`La cantidad debe ser un número positivo, así no es correcto`);
    }

    const productInCartIndex = cart.products.findIndex(
      (p) => p.product._id == productId
    )
    if (productInCartIndex < 0) {
      throw new Error(`El producto con id ${productId} no se encuentra en el carrito`);
    }

    cart.products[productInCartIndex].quantity = parseInt(quantity);
    console.log("productInCartIndex", cart.products[productInCartIndex], quantity);
  
  await cartModel.updateOne({ _id: cartId }, cart)

  return this.getCart(cartId)
  }

}

module.exports = CartsManager;
