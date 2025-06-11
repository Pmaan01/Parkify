const mongoose = require('mongoose');

// Connect to Auth DB (Main Cluster A)
const authConnection = mongoose.createConnection(process.env.MONGO_URI);
authConnection.on('connected', () => console.log('✅ Connected to Auth DB'));

// Create separate mongoose instance for Parking DB (Cluster B)
const mongooseParking = require('mongoose');
const parkingConnection = mongooseParking.createConnection(`${process.env.MONGO_URI_1}${process.env.DB_NAME}?retryWrites=true&w=majority`);
parkingConnection.on('connected', () => console.log('✅ Connected to Parking DB'));

module.exports = { authConnection, parkingConnection };
