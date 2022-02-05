const mongoose = require('mongoose');
const cartmodel = {
    userId: {
        type: String,
        unique: true,
        required: [true, ""],
    },
    products: {
        type: Array,
    }
}
const cart = mongoose.model("cart", cartmodel)
module.exports = cart;

