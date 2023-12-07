const mongoose = require("mongoose");
const { get } = require("lodash");

const { Parcel } = require("../../models/parcel");
const { User } = require("../../models/user");

const { BIKER } = require("../../constants/constants");
const encodeURIPass = require("../../utils/encodeURIPass");

const uri = encodeURIPass(process.env.MONGO_URL);

const handler = async (event) => {
    try {
        await mongoose.connect(uri);
        const userId = get(event, ['pathParameters', 'userId'], '');
        const user = await User.findOne({ userId });
        let parcels =[];
        if (user.type === BIKER) {
            parcels = await Parcel.find({ $or: [ {bikerDelivering: userId}, {bikerDelivering: null}] }).lean().exec();
        } else {
            parcels = await Parcel.find({ userCreated: userId }).lean().exec();
        }
        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parcels),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: 'Error while getting parcels' }),
        };
    } finally {
        await mongoose.disconnect();
    }
};

module.exports = { handler };
