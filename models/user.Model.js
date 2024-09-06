const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    cpassword: { type: String, required: true },
},{versionKey:false})

const userModel = mongoose.model("user", userschema);
module.exports = userModel;
