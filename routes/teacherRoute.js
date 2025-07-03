const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const authenticate = require('../middleware/teacherAuth');
const Subject = require('../models/Subject');
const Library = require('../models/Libraries'); // ✅ Add this at the top if not present


// Helper: Valid tab views
const validPages = ['home', 'course', 'libraries', 'review'];

/**
 * Default Dashboard - Redirect to home tab
 */
router.get('/dashboard/:userId', authenticate, async (req, res) => {
  const userId = req.params.userId;
  const loggedInUserId = req.user.id;

  // Check if authenticated user matches the route userId
  if (userId !== String(loggedInUserId)) {
    return res.status(403).send('Unauthorized access');
  }

  const user = await User.findById(userId);
  if (!user || !['tutor', 'institute'].includes(user.role)) {
    return res.status(403).send('Invalid user or role');
  }

  // Redirect to home tab
  return res.redirect(`/dashboard/${userId}/home`);
});

/**
 * Tab-specific dashboard page (home, course, libraries, review)
 */
router.get('/dashboard/:userId/:section', authenticate, async (req, res) => {
  const { userId, section } = req.params;
  const loggedInUserId = req.user.id;

  if (userId !== String(loggedInUserId)) {
    return res.status(403).send('Unauthorized access');
  }

  if (!validPages.includes(section)) {
    return res.status(404).send('Page not found');
  }

  const user = await User.findById(userId);
  const profile = await Profile.findOne({ user: userId });
  const subjects = await Subject.find({ user: userId });

  if (!user || !['tutor', 'institute'].includes(user.role)) {
    return res.status(403).send('Invalid user or role');
  }

  // 🔍 Fetch libraries only if the tab is "libraries"
  let libraries = [];
  if (section === 'libraries') {
    libraries = await Library.find({ uploadedBy: userId }).populate('uploadedBy', 'name');
  }

  res.render('teacher-institute/teacher-institute-dashboard', {
    title: `${user.name}'s Dashboard`,
    user,
    subjects,
    editMode: false,
    profile,
    page: section,
    libraries // ✅ Pass to EJS
  });
});



// ----------------------------
// Profile API Routes
// ----------------------------

/**
 * Create profile (POST)
 */
router.post('/api/profiles', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const existing = await Profile.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const profile = new Profile({
      user: userId,
      ...req.body,
      status: 'under_review'
    });

    await profile.save();
    res.status(201).json({ message: 'Profile created', profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Update profile (PUT)
 */
router.put('/api/profiles', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    Object.assign(profile, {
      ...req.body,
      status: 'under_review' // Re-review on edit
    });

    await profile.save();
    res.json({ message: 'Profile updated successfully', profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get current user's profile (GET)
 */
router.get('/api/profiles/me', authenticate, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/api/best-teachers', async (req, res) => {
  try {
    const levels = ['beginner', 'intermediate', 'advanced'];
    const levelGroups = {};

    for (const level of levels) {
      const subjects = await Subject.find({ level }).populate('user');
      const teacherIds = [...new Set(subjects.map((s) => s.user._id.toString()))];
      const profiles = await Profile.find({ user: { $in: teacherIds } }).populate('user');
      levelGroups[level] = profiles;
    }

    res.json(levelGroups); // { beginner: [...], intermediate: [...], advanced: [...] }
  } catch (err) {
    console.error('Error fetching best teachers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
