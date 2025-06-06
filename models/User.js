// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hash this in practice
  role: { type: String, enum: ['student', 'tutor', 'institute'], required: true },
  phone: String,
  profilePicture: String,
  cookieId: { type: String, required: true, unique: true },  // For storing the unique cookie ID
  jwtToken: { type: String }  // JWT token stored here
}, { timestamps: true });

userSchema.methods.generateJWT = function() {
  const token = jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '3d' });
  this.jwtToken = token;  // Save the JWT in the user document
  return token;
};

module.exports = mongoose.model('User', userSchema);
