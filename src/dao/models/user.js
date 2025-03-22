const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: { type: String },
  cart: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "carts" }],
  },
  role: {
    type: String,
    default: "user",
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
