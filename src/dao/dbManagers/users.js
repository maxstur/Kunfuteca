const UserModel = require("../models/user");

class Users {
  constructor() {
    console.log("New instance of db manager");
  }

  async getAll() {
    let users = await UserModel.find().populate("cart").lean();
    return users;
  }

  async saveUser(user) {
    let result = await UserModel.create(user);
    return result;
  }

  async getById(id) {
    let user = await UserModel.findById(id).populate("cart").lean();
    return user;
  }

  async getBy(params) {
    let result = await UserModel.findOne(params).populate("cart").lean();
    return result;
  }

  async updateUser(id, user) {
    let result = await UserModel.updateOne({ _id: id }, user);
    return result;
  }
}

module.exports = Users;
