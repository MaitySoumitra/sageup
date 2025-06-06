// routes/userRoutes.js
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');  // For generating unique cookie IDs

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // Generate a new cookie ID for this session
    const cookieId = uuidv4();

    // Generate JWT and save it in the user document
    const token = user.generateJWT();

    // Store cookieId in user document for reference
    user.cookieId = cookieId;
    await user.save();

    // Set the cookie ID in the response
    res.cookie('cookieId', cookieId, { httpOnly: true, secure: true, maxAge: 3 * 24 * 60 * 60 * 1000 }); // 3 days expiration

    res.status(200).json({ 
      message: 'Login successful',
      cookieId: cookieId,  // Send the cookie ID back
      user: { id: user._id, name: user.name, role: user.role }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = new User({ name, email, password, role, phone });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User login

// Get user profile


// routes/userRoutes.js (continue)
router.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = user.generateJWT();

    // Update JWT token in the database
    user.jwtToken = newAccessToken;
    await user.save();

    // Set the new JWT token in cookies
    res.cookie('jwt', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3 * 24 * 60 * 60 * 1000
    });

    res.json({ message: 'Token refreshed', token: newAccessToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Failed to refresh token' });
  }
});
// routes/userRoutes.js
router.post('/logout', async (req, res) => {
  const cookieId = req.cookies.cookieId;

  if (!cookieId) return res.status(400).json({ message: 'No active session' });

  try {
    const user = await User.findOne({ cookieId });
    if (!user) return res.status(400).json({ message: 'Invalid session' });

    // Clear the JWT from the user document
    user.jwtToken = null;
    user.cookieId = null;
    await user.save();

    // Clear the cookie
    res.clearCookie('cookieId', { httpOnly: true, secure: true });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error logging out' });
  }
});


module.exports = router;

