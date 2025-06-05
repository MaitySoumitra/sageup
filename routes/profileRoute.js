const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const userAuth = require('../middleware/userAuth');

// ✅ Create profile (only for tutor/institute)
router.post('/', userAuth, async (req, res) => {
  const { type, subjectsOffered, location, experience, description, availability, fees } = req.body;

  if (!['private_tutor', 'coaching_center', 'small_institute'].includes(type)) {
    return res.status(400).json({ message: 'Invalid profile type' });
  }

  try {
    const existing = await Profile.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const profile = new Profile({
      user: req.user.id,
      type,
      subjectsOffered,
      location,
      experience,
      description,
      availability,
      fees
    });

    await profile.save();
    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (err) {
    console.error('Error creating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Get logged-in user's profile
router.get('/me', userAuth, async (req, res) => {
  const userId = req.user.id; // Coming from token

  try {
    const profile = await Profile.findOne({ user: userId }).populate('user', 'name email role');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



// ✅ Update profile
router.put('/me', userAuth, async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Delete profile
router.delete('/me', userAuth, async (req, res) => {
  try {
    const deleted = await Profile.findOneAndDelete({ user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Get all profiles (for students to browse)
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', 'name email role');
    res.status(200).json({ profiles });
  } catch (err) {
    console.error('Error fetching profiles:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Search profiles by subject or location (optional query filters)
router.get('/search', async (req, res) => {
  const { subject, location } = req.query;

  try {
    const filters = {};
    if (subject) filters.subjectsOffered = { $regex: subject, $options: 'i' };
    if (location) filters.location = { $regex: location, $options: 'i' };

    const results = await Profile.find(filters).populate('user', 'name email role');
    res.status(200).json({ results });
  } catch (err) {
    console.error('Error searching profiles:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
