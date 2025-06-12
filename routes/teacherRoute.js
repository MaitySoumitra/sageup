const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticate = require('../middleware/teacherAuth');

router.get('/dashboard/:userId', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;
    const loggedInUserId = req.user.id;

    if (userId !== String(loggedInUserId)) {
      return res.status(403).send('Unauthorized access');
    }

    const user = await User.findById(userId);
    if (!user || !['tutor', 'institute'].includes(user.role)) {
      return res.status(403).send('Invalid user or role');
    }

    res.render('teacher-institute/teacher-institute-dashboard', {
      title: `${user.name}'s Dashboard`,
      user,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Server error');
  }
});
module.exports = router;