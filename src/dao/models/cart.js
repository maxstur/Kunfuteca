const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: Number,
      },
    ],
    default: [],
  },
  total: { type: Number, default: 0 },
  user: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }], default: [] },
});

const cartModel = mongoose.model("carts", cartSchema);

module.exports = cartModel;
