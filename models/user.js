const mongoose = require('mongoose');
const usermodel = {
    userId: {
        type: String,
        unique: true,
        required: [true, ""],
    },
    fname: {
        type: String,
        // unique: true,
        required: [true, "Please enter your name"],
    },
    lname: {
        type: String,
        // unique: true,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        // unique: true,
        required: [true, "Please enter your email"],
    },
    mobile: {
        type: Number,
        required: [true, "Please enter your mobile number"],
        minlength: 10,
        maxlength: 10,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
    },
    role: {
        type: String,
        // required: [true, "Please enter your role"],
        default: "user"
    }
}
const user = mongoose.model("user", usermodel)
module.exports = user;