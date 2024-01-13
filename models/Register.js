const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    phoneNo: {
        type: String,
        default: 0,
        unique: true
    },
    rollNo: {
        type: String,
        unique: true
    },
    whyToAttend: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Register", registerSchema);
