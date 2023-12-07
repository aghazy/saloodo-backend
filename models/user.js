const mongoose = require('mongoose');
const { BIKER, SENDER } = require('../constants/constants');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true},
    userId: { type: String, required: true },
    type: { type: String, required: true, enum: [BIKER, SENDER] },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = { User };
