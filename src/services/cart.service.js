const MailingService = require("./mailing.service");

const mailingService = new MailingService();

class CartService {
  constructor(dao, productsService, tiketsService) {
    this.dao = dao;
    this.productsService = productsService;
    this.tiketsService = tiketsService;
  }
  async getAll() {
    return await this.dao.getAll();
  }
  async getById(id) {
    const cart = await this.dao.getById(id);

    if (!cart) {
      throw {
        message: `The cart ${id} does not exist`,
        status: 400,
      };
    }
    return cart;
  }
  async create() {
    const cart = { products: [] };
    await this.dao.create(cart);
  }
  async update(id, product) {
    const foundCart = await this.dao.getById(id);
    if (!foundCart) {
      throw {
        message: `The cart ${id} does not exist`,
        status: 400,
      };
    }
    return await this.dao.update(id, product);
  }
  async delete(id) {
    const cart = await this.dao.getById(id);
    if (!cart) {
      throw {
        message: `The cart ${id} can't be deleted, it does not exist`,
        status: 400,
      };
    }
    return await this.dao.delete(id);
  }
  async addProduct(id, productId) {
    const cart = await this.dao.getById(id);
    const index = cart.products.findIndex(
      (product) => product.product._id == productId
    );
    if (index >= 0) {
      cart.products[index].quantity++;
    } else {
      //await this.productsService.getById(productId);
      cart.products.push({ product: productId, quantity: 1 });
    }
    await this.dao.update(id, cart);
    return cart;
  }
  async deleteProductById(cartId, productId) {
    const cart = await this.dao.getById(cartId);
    const index = cart.products.findIndex(
      (product) => product.product._id == productId
    );
    if (index >= 0) {
      cart.products.splice(index, 1);
    }
    return await this.dao.update(cartId, cart);
  }
  async updateCartProducts(cartId, products) {
    await this.dao.getById(cartId);
    await this.dao.update(cartId, { products: content });
    return this.dao.getById(cartId);
  }
  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await this.dao.getById(cartId);
    await this.productsService.getById(productId);

    if (!quantity || isNaN(quantity) || quantity < 0) {
      throw {
        message: "Quantity must be a positive number it's not valid",
        status: 400,
      };
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product._id == productId
    );
    if (productIndex >= 0) {
      throw {
        message: `Product with id ${productId} does not exist the cart`,
        status: 400,
      };
    }
    cart.products[productIndex].quantity = parseInt(quantity);
    await this.dao.update(cartId, cart);
    return this.dao.getById(cartId);
  }

  async cleanCart(cartId) {
    const cart = await this.dao.getById(cartId);
    if (!cart) {
      throw new Error(`Cart with id ${cartId} wasn't found`);
    }
    await this.dao.update(cartId, { products: [] });
    return this.dao.getById(cartId);
  }

  async purchase(cartId, userEmail) {
    const cart = await this.dao.getById(cartId);

    const notPurchasedIds = [];
    let totalAmount = 0;

    for (let i = 0; i < cart.products.length; i++) {
      const product = cart.products[i];
      const remainder = product.product.stock - product.quantity;
      if (remainder >= 0) {
        await this.productsService.update(product.product._id, {
          ...product.product,
          stock: remainder,
        });
        await this.deleteProductById(cartId, product.product._id.toString());
        totalAmount += product.product.price * product.quantity;
      } else {
        notPurchasedIds.push(product.product._id.toString());
      }
    }
    if (totalAmount > 0) {
      await this.tiketsService.generate(userEmail, totalAmount);
      await mailingService.sendPurchaseEmail(req.user.email);
    }
    return { notPurchasedIds };
  }
}
module.exports = CartService;
