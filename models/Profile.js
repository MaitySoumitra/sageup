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
    days: [String],
    timeSlots: [String]
  },
  fees: Number,

  // ✅ New field for admin review
  status: {
    type: String,
    enum: ['under_review', 'approved', 'rejected'],
    default: 'under_review'
  }

}, { timestamps: true });


module.exports = mongoose.model('Profile', profileSchema);
