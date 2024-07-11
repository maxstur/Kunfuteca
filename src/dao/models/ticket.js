const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    purchase_datetime: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
});

const ticketModel = mongoose.model("tickets", ticketSchema);

module.exports = ticketModel;