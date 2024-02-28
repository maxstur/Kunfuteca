const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        type: String,
        quantity: Number,
      },
    ],
    default: [],
  },
});

const cartModel = mongoose.model("carts", cartSchema);

module.exports = cartModel;
