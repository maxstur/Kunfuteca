const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String, 
  email: String,
  age: Number,
  password: String,
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
