// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hash this in practice
  role: { type: String, enum: ['student', 'tutor', 'institute'], required: true },
  phone: String,
  profilePicture: String
}, { timestamps: true });


userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);

