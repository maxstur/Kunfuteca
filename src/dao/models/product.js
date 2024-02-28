const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  description: {
    type: String,
  },
});

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
