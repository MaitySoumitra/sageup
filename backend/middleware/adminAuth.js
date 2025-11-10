const User = require('../models/User');
const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
  const cookieId = req.cookies.cookieId;
  if (!cookieId) return res.redirect('/api/user/login'); // ✅ fix

  try {
    const user = await User.findOne({ cookieId });
    if (!user || !user.jwtToken) return res.redirect('/api/user/login'); // ✅ fix

    const decoded = jwt.verify(user.jwtToken, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).send('Access denied. Admins only.');
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.redirect('/api/user/login');
  }
};

module.exports = adminAuth;

