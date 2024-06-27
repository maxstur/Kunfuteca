const ProductsService = require("../services/products.service");

const productsService = new ProductsService();

class ProductsController {
  static async getAll(req, res) {
    let query = req.query;

    try {
      const { docs, ...rest } = await productsService.getAll(query);
      res.send({ status: "success", payload: { docs, ...rest } });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      let product = await productsService.getById(req.params.id);

      if (!product)
        throw {
          message: `The product ${req.params.id} does not exist`,
          status: 400,
        };
      product = product.toObject();
      res.send({ product });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newProduct = req.body;
      await productsService.create(newProduct);

      const products = await productsService.getAll();
      req.io.emit("Lista actualizada", { products });
      res.send({ status: "success", details: products });
    } catch (error) {
      res.status(error.status || 500).send({ error: error.message });
    }
  }

  static async update(req, res) {
    const id = req.params.pid;

    try {
      const result = await productsService.update(id, req.body);

      res.send({
        status: "success",
        details: result,
        message: "Update actualizado",
      });
    } catch (error) {
      console.log("error", error);
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async delete(req, res) {
    const id = req.params.pid;
    try {
      const result = await productsService.delete(id);
      res.send({ status: "success", details: result });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }
}

module.exports = ProductsController;
