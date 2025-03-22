const userModel = require("../models/user");

class UsersDao {
    async getAll() {
        return await userModel.find().lean();
    }

    async getById(id) {
        return await userModel.findById({_id:id}).populate("products.product").lean();
    }

    async getByProperty(property, name) {
        let opts = {};
        opts[property] = name;
        return await userModel.findOne(opts).lean();
    }

    async create(product) {
        return await userModel.create(product);
    }

    async update(id, product) {
        return await userModel.updateOne({ _id: id }, product);
    }

    async delete(id) {
        return await userModel.deleteOne({ _id: id });
    }
}

module.exports = UsersDao