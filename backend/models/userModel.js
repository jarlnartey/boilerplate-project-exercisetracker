const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    /* count: { type: Number, required: false },*/
    log: { type: [Object], required: false }
})

module.exports = mongoose.model("User", userSchema)