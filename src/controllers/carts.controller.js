const CartService = require("../services/carts.service");

const cartsService = new CartService();

// El cartService es mi acceso a la capa de persistencia
// El cartController es mi acceso a la capa de logica de negocios
// El cartController solo interactua con el cartService

class CartsController {
  static async create(req, res) {
    try {
      await cartsService.create();
      res.send({ status: "Success" });
    } catch (error) {
      return res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async getById(req, res) {
    const id = req.params.id;
    try {
      const cart = await cartsService.getById(id);
      res.send({ status: "success", products: cart.products });
    } catch (error) {
      return res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async addProduct(req, res) {
    const id = req.params.id;
    const productId = req.params.pid;

    try {
      const result = await cartsManager.addProduct(id, productId);
      res.send({ status: "success", payload: result });
    } catch (error) {
      return res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }

    res.send({ status: "Product successfully added" });
  }

  static async deleteProduct(req, res) {
    const { cid, pid } = req.params;
    try {
      const result = await cartsService.deleteProductById(cid, pid);
      res.send({ status: "success", payload: result });
    } catch (error) {
      return res.status(error.status || 500).send({
        status: "error",
        error: error.message,
      });
    }
  }

  static async updateProductQuantity(req, res) {
    const { id, pid } = req.params;
    const quantity = req.body.quantity;

    try {
      const result = await cartsService.updateProductQuantity(
        id,
        pid,
        quantity
      );
      res.send(result);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async updateCartProducts(req, res) {
    const { id } = req.params;
    try {
      const result = await cartsService.updateCartProducts(id, req.body);
      res.send(result);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async cleanCart(req, res) {
    const { id } = req.params;
    try {
      const result = await cartsService.cleanCart(id);
      res.send(result);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }
}

module.exports = CartsController;
