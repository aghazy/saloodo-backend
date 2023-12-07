const mongoose = require('mongoose');

const parcelSchema = new mongoose.Schema({
    userCreated: { type: String, required: true },
    bikerDelivering: { type: String },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    pickedUpOn: { type: Date },
    deliveredOn: { type: Date },
}, { timestamps: true });

const Parcel = mongoose.model('Parcel', parcelSchema);

module.exports = { Parcel };
