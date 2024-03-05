const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: String,
        quantity: Number,
      },
    ],
    default: [],
  },
});

const cartModel = mongoose.model("carts", cartSchema);

module.exports = cartModel;
