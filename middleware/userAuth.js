const User = require('../models/User');
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
  const cookieId = req.cookies.cookieId;
  if (!cookieId) return res.status(401).json({ message: 'Authentication required' });

  const user = await User.findOne({ cookieId });
  if (!user || !user.jwtToken) return res.status(403).json({ message: 'Invalid session' });

  try {
    const decoded = jwt.verify(user.jwtToken, process.env.JWT_SECRET);
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = userAuth;
