const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // NOTE: If you need 'institute' or 'admin', keep them, but ensure client-side roles match.
    role: { type: String, enum: ['admin', 'student', 'tutor', 'institute'], required: true },
    phone: String,
    profilePicture: String,
    // REMOVED: cookieId: { type: String, unique: true }, 
    // REMOVED: jwtToken: { type: String } 
}, { timestamps: true });

// Pre-save hook for password hashing (remains the same and is secure)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to generate JWT (STATLESS: doesn't save to DB)
userSchema.methods.generateJWT = function () {
    // Token valid for 3 days
    const token = jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '3d' });
    return token;
};

module.exports = mongoose.model('User', userSchema);