const mongoose = require('mongoose');
const productmodel = {
    userId: {
        type: String,
        required: [true, ""],
    },
    productId:{
        type: String,
        required: [true, ""],
    },
    title: {
        type: String,
        required: [true, ""],
    },
    description: {
        type: String,
        required: [true, ""],
    },
    price: {
        type: String,
        required: [true, ""],
    },
    image: {
        type: String,
        required: [true, ""],
    }
}
const product = mongoose.model("product", productmodel);
module.exports = product;