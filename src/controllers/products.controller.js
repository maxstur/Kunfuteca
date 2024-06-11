const ProductManager = require("../dao/dbManagers/ProductManager");

const productManager = new ProductManager();

class ProductsController {
  static async getAll(req, res) {
    let query = req.query;

    try {
      const { docs, ...rest } = await productManager.getAll(query);
      res.send({ status: "success", payload: { docs, ...rest } });
    } catch (error) {
      res.send({ status: "error", error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      let product = await productManager.getById(req.params.id);
      res.send({ product: product });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newProduct = req.body;
      await ProductManager.addProduct(newProduct);

      const products = await productManager.getAll();
      req.io.emit("Lista actualizada", { products });
      res.redirect( "/realtimeproducts" );
    } catch (error) {
      res.status(500).send({ error: "Error al agregar nuevo elemento" });
    }
  }

  static async update(req, res) {
    const id = req.params.pid;

    try {
      const result = await productManager.update(id, req.body);
      
      res.send({ status: "success", details: result, message: "Update actualizado" });
    } catch (error) {
      res.status(error.status || 500).send({ status: "error", error: "Error al actualizar el producto" });
    }
  }

  static async delete(req, res) {
    const id = req.params.pid;
    try {
      const result = await productManager.delete(id);
      res.send({ status: "success", details: result });
    } catch (error) {
      res.status(500).send({ status: "error", error: "Error al eliminar producto" });
    }
  }
}

module.exports = ProductsController;
