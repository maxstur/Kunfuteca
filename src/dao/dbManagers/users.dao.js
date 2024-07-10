const userModel = require("../models/user");

class UsersDao {
    async getAll() {
        return await userModel.find().lean();
    }

    async saveUser(user) {
        return await userModel.create(user);
    }

    async getById(id) {
        return await userModel.findById({_id:id}).populate("cart").lean();
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