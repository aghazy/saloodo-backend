const mongoose = require("mongoose");
const { get } = require("lodash");

const { Parcel } = require("../../models/parcel");
const encodeURIPass = require("../../utils/encodeURIPass");

const DELIVERED = 'DELIVERED';
const uri = encodeURIPass(process.env.MONGO_URL);

const handler = async (event) => {
    try {
        await mongoose.connect(uri);
        const userId = get(event, ['pathParameters', 'userId'], '');
        const parcelId = get(event, ['pathParameters', 'parcelId'], '');
        const body = JSON.parse(get(event, 'body', ''));
        const parcel = await Parcel.findById(parcelId);
        
        if (parcel.bikerDelivering && parcel.bikerDelivering !== userId) {
            return {
                statusCode: 401,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: 'The Parcel is being delivered by another biker' }),
            }
        }

        if (body.status === DELIVERED) {
            await Parcel.findOneAndUpdate({ _id: parcelId }, {deliveredOn: new Date()}).lean().exec();
        } else {
            await Parcel.findOneAndUpdate({ _id: parcelId }, {pickedUpOn: new Date(), bikerDelivering: userId}).lean().exec();
        }
        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: 'Parcel status updated successfully!' }),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: 'Error while updating parcel\'s status' }),
        };
    } finally {
        await mongoose.disconnect();
    }
};

module.exports = { handler };
