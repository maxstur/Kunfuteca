const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  message: {
    type: String,
  },
});

const messageModel = mongoose.model("messages", messageSchema);

module.exports = messageModel;
