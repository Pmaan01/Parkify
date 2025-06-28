const mongoose = require('mongoose');

const FreeParkingSchema = new mongoose.Schema({
  name: String,
  type: String,
  area: String,
  address: String,
  latitude: Number,
  longitude: Number,
  paid: Boolean,
  rate: String,
  time_limit: String,
  creditcard: String,
  hours: String,
  notes: String,
  hasSpots: Boolean,
  availableSpots: Number
});

module.exports = mongoose.model("FreeParking", FreeParkingSchema);
