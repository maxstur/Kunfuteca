const CartsManager = require("../dao/dbManagers/CartsManager");
const ProductManager = require("../dao/dbManagers/ProductManager");
const cartsManager = new CartsManager(__dirname + "/../files/carts.json");
const productManager = new ProductManager(
  __dirname + "/../files/products.json"
);

class CartsController {
  static async create(req, res) {
    //api/carts
    try {
      await cartsManager.addCart();
      res.send({ status: "Carrito creado exitosamente" });
    } catch (error) {
      res
        .status(500)
        .send({ status: "error", error: "Error al crear carrito" });
    }
  }

  static async getCartById(req, res) {
    //api/carts/:id
    const id = req.params.id;
    try {
      const cart = await cartsManager.getCartById(id);
      res.send({ status: "success", products: cart.products });
    } catch (error) {
      return res
        .status(500)
        .send({ status: "error", error: "Error al obtener carrito" });
    }
  }

  static async addProduct(req, res) {
    //Traer logica de CartManager "addProduct". De acá en adelante no es api rest
    const id = req.params.id;
    const productId = req.params.pid;

    try {
      const cart = await cartsManager.getCart(id); // Obtener el cart del cartService
      const product = await productManager.getProduct(productId); // Obtener el cart del productService

      if (!cart) {
        res.status(400).send({ message: "El carrito no existe" });
      }
      if (!product) {
        res.status(400).send({ message: "El producto no existe" });
      }

      // cartsManager.addProduct(id, productId);
      // const cart = await this.getCart(id);

      const index = cart.products.findIndex((p) => p.product == productId);

      if (index >= 0) {
        cart.products[index].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cartModel.updateOne({ _id: id }, cart); //<-- Actualizar el carrito usando cartService

    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }

    res.send({ status: "Producto agregado exitosamente al carrito" });
  }

  static async deleteProduct(req, res) {
    //Traer logica de CartManager.
    const { cid, pid } = req.params;
    try {
      const result = await cartsManager.deleteProductById(cid, pid);
      res.send({ status: "success", payload: result });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        error: "Error al eliminar un producto del carrito",
      });
    }
  }

  static async updateProductQuantity(req, res) {
    //Traer logica de CartManager "addProduct"
    const { id, pid } = req.params;
    const quantity = req.body.quantity;

    try {
      const result = await cartsManager.updateProductQuantity(
        id,
        pid,
        quantity
      );
      res.send(result);
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async updateCartProducts(req, res) {
    //Traer logica de CartManager
    const { id } = req.params;
    const products = req.body;
    try {
      const result = await cartsManager.updateCartProducts(id, products);
      res.send(result);
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async cleanCart(req, res) {
    //Traer logica de CartManager
    const id = req.params.id;
    try {
      const result = await cartsManager.cleanCart(id);
      res.send(result);
    } catch (error) {
      return res.status(500).send({ status: "error", error: error.message });
    }
  }
}

module.exports = CartsController;
