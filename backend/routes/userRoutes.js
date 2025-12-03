const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Profile=require('../models/Profile')


// --- Helper Middleware (For Protected Routes) ---
// You will need to export and use this in your routes

const MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;
const protect = async (req, res, next) => {
    let token;
    
    // 1. Check for the unified authentication cookie
    if (req.cookies.authToken) {
        token = req.cookies.authToken; 
    }

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        // 2. Verify and decode the JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach user data (without password) to the request
        req.user = await User.findById(decoded.id).select('-password'); 
        
        if (!req.user) {
             return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        // If token is expired or invalid
        console.error('Auth token error:', error);
        return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
};
// --------------------------------------------------

// ✅ Register a new user (Auto-Login implemented here)
router.post('/register', async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password, role, phone });
    await newUser.save();

    // --- Create profile if tutor ---
    let profile = null;
    if (role === 'tutor') {
      profile = new Profile({
        user: newUser._id,
        type: 'private_tutor',  // default type, can be updated later
        contactInfo: { phone, email }
      });
      await profile.save();

      // Link profile to user
      newUser.profile = profile._id;
      await newUser.save();
    }

    const token = newUser.generateJWT();

    res.cookie('authToken', token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.status(201).json({
      message: 'User registered successfully and logged in',
      user: { id: newUser._id, name: newUser.name, role: newUser.role, profile: profile?._id || null },
      redirectTo: role === 'tutor' ? `/dashboard/${newUser._id}` : '/'
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route for traditional server-side rendering (kept for context)
router.get('/login', (req, res) => {
    res.render('user/login', { title: 'Login' });
});

// ✅ User login (STATLESS: No DB updates)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        // Use 401 and generic message for security
        if (!user) return res.status(401).json({ message: 'Invalid credentials' }); 

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // 1. Generate the JWT (Stateless)
        const token = user.generateJWT(); 

        // 2. Define secure cookie options
        const cookieOptions = {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        };
      

        // 3. Set the JWT as the primary authentication cookie
        res.cookie('authToken', token, cookieOptions);

        // **REMOVED: Database updates for cookieId and jwtToken**

        let redirectTo = '/';
        if (user.role === 'admin') {
            redirectTo = '/admin/sageup-dashboard';
        } else if (user.role === 'tutor' || user.role === 'institute') {
            redirectTo = `/dashboard/${user._id}`;
        } else if (user.role === 'student') {
            redirectTo = '/student/dashboard';
        }

        res.status(200).json({
            message: 'Login success',
            user: { id: user._id, name: user.name, role: user.role },
            redirectTo
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Logout (STATLESS: Simply clears the cookie)



// ❌ Token Refresh Route (Removed as it was stateful and complex)
// For a simple single-token approach, this is unnecessary.
// If your security requirements change, you'd reintroduce it with a separate refresh token.
router.post('/refresh-token', (req, res) => {
    return res.status(404).json({ message: 'Token refresh route removed. Use the main authToken cookie for session persistence.' });
});


// Example Protected Route
router.get('/profile', protect, (req, res) => {
    // The user data is available at req.user, fetched via the middleware
    res.json({ message: 'Profile data', user: req.user });
});

router.post('/logout', (req, res) => {
    // Clear the 3-day authentication cookie
    res.clearCookie('authToken', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict' 
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;