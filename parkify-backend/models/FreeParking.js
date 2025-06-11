const mongoose = require('mongoose');
const { parkingConnection } = require('../db');

const FreeParkingSchema = new mongoose.Schema({
  name: String,
  type: String,
  address: String,
  latitude: Number,
  longitude: Number,
  free: Boolean,
  hours: String,
  notes: String
});

const FreeParking = parkingConnection.model("FreeParking", FreeParkingSchema);
module.exports = FreeParking;
