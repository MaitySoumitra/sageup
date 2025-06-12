const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const cookieId = req.cookies.cookieId;
  if (!cookieId) return res.status(401).send('Not logged in');

  const user = await User.findOne({ cookieId });
  if (!user || !user.jwtToken) return res.status(403).send('Invalid session');

  try {
    const decoded = jwt.verify(user.jwtToken, process.env.JWT_SECRET);
    if (decoded.id !== user._id.toString()) {
      return res.status(403).send('Invalid token');
    }

    if (!['tutor', 'institute'].includes(user.role)) {
      return res.status(403).send('Unauthorized role');
    }

    req.user = { id: user._id.toString(), role: user.role, name: user.name }; // force id to string
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(403).send('Authentication failed');
  }
};
