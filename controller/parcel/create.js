const mongoose = require("mongoose");
const { get } = require("lodash");

const { Parcel } = require("../../models/parcel");
const encodeURIPass = require("../../utils/encodeURIPass");

const uri = encodeURIPass(process.env.MONGO_URL);

const handler = async (event) => {
    try {
        await mongoose.connect(uri);
        const userId = get(event, ['pathParameters', 'userId'], '');
        const body = JSON.parse(event.body);
        const parcel = new Parcel({
            userCreated: userId,
            origin: body.origin,
            destination: body.destination,
        });
        await parcel.save();
        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: 'Parcel created successfully!' }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: 'Error while creating parcel' }),
        };
    } finally {
        await mongoose.disconnect();
    }
};

module.exports = { handler };
