const mongoose = require("mongoose");
const { get } = require('lodash');

const { User } = require('../../models/user');
const encodeURIPass = require("../../utils/encodeURIPass");

const uri = encodeURIPass(process.env.MONGO_URL);

const handler = async (event) => {
    const userId = get(event, ['pathParameters', 'userId'], '');
    try {
        await mongoose.connect(uri);
        const user = await User.find({userId}).lean().exec();
        return { 
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        }
    } catch (error) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: `User ${userId} not found.` }),
        };
    }
};

module.exports = { handler }
