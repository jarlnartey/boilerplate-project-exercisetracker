const mongoose = require("mongoose")
const userModel = require("../models/userModel")
require('dotenv').config()

const connectDB = async () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB