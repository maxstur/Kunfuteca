const cartModel = require("../models/cart");

class CartsDao {
    async getAll() {
        return await cartModel.find().lean();
    }   

    async getById(id) {
        return await cartModel.findOne({ _id: id }).populate.lean();
    }

    async create(product) {
        return await cartModel.create(product);
    }

    async update(id, product) {
        return await cartModel.updateOne({ _id: id }, product);
    }

    async delete(id) {
        return await cartModel.deleteOne({ _id: id });
    }
}

module.exports = CartsDao