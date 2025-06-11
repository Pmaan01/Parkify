const mongoose = require('mongoose');
const { authConnection } = require('../db');

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  // other fields
});

const User = authConnection.model("User", UserSchema);
module.exports = User;
