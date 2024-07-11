const { cartsService, productsService } = require("../repositories/index");
const { generateProducts } = require("../utils/generateProducts");

class MocksController {
  static async getUsers(req, res) {
    try {
      let mockProducts = [];
      for (let i = 0; i < 100; i++) {
        let products = generateProducts();
        mockProducts.push(...products);
      }
      res.send({
        status: "success",
        payload: mockProducts,
      });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }
}
module.exports = MocksController;
