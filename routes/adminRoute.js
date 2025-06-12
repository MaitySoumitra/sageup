const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

router.get('/login', (req, res) => {
  res.render('user/login', { title: 'Admin Login' });
});



router.get('/sageup-dashboard', adminAuth, async (req, res) => {
  try {
    const pendingProfiles = await Profile.find({ status: 'under_review' }).populate('user');
    const approvedCount = await Profile.countDocuments({ status: 'approved' });
    const rejectedCount = await Profile.countDocuments({ status: 'rejected' });
    const pendingCount = pendingProfiles.length;

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      pendingProfiles,
      approvedCount,
      rejectedCount,
      pendingCount
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).send('Error loading dashboard');
  }
});


router.get('/pending-profiles', adminAuth, async (req, res) => {
  try {
    const profiles = await Profile.find({ status: 'under_review' }).populate('user', 'name email');
    res.render('admin/pending-profiles', { title: 'Pending Profiles', profiles });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profiles' });
  }
});

// ✅ Admin updates profile status
router.post('/profile/:id/status', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected', 'under_review'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const profile = await Profile.findById(id).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.status = status;
    await profile.save();

    res.status(200).json({ message: `Profile ${status} successfully`, profile });
  } catch (err) {
    console.error('Admin status update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
