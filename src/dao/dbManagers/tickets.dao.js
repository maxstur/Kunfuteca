const ticketModel = require("../../models/ticket");

class TicketsDao {
    async getAll() {
        return await ticketModel.find().lean();
    }

    async getById(id) {
        return await ticketModel.findById(_id).populate("products.product").lean();
    }

    async create(product) {
        return await ticketModel.create(product);
    }

    async update(id, product) {
        return await ticketModel.findById(id, product);
    }

    async delete(id) {
        return await ticketModel.findByIde(id);
    }
}

module.exports = TicketsDao