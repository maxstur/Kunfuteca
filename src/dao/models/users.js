const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  cart: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
