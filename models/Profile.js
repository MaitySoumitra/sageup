// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['private_tutor', 'coaching_center', 'small_institute'], required: true },
  subjectsOffered: [String],
  location: String,
  experience: Number,
  description: String,
  availability: {
    days: [String], // e.g., ['Monday', 'Wednesday']
    timeSlots: [String] // e.g., ['10AM-12PM', '4PM-6PM']
  },
  fees: Number
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
