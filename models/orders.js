const mongoose = require('mongoose');
const ordermodule = {
    userId: {
        type: String,
        required: [true, ""],
    },
    orderId: {
        type: String,
        required: [true, ""],
    },
    products: {
        type: Array,
        required: [true, ""],
    },
    amount: {
        type: String,
        required: [true, ""],
    },
    
}
const orders = mongoose.model("orders", ordermodule);
module.exports = orders;