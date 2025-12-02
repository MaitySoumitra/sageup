const User = require('../models/User');
const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
  const cookieId = req.cookies.cookieId;
  
  // Check if request is from API (React) or browser
  const isApiRequest = req.originalUrl.startsWith('/vidyaru-dashboard') || req.originalUrl.startsWith('/pending-profiles');

  if (!cookieId) {
    if (isApiRequest) return res.status(401).json({ message: 'Not authenticated' });
    return res.redirect('/admin/login'); // server-side page
  }

  try {
    const user = await User.findOne({ cookieId });
    if (!user || !user.jwtToken) {
      if (isApiRequest) return res.status(401).json({ message: 'Not authenticated' });
      return res.redirect('/admin/login');
    }

    const decoded = jwt.verify(user.jwtToken, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      if (isApiRequest) return res.status(403).json({ message: 'Access denied. Admins only.' });
      return res.status(403).send('Access denied. Admins only.');
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    if (isApiRequest) return res.status(401).json({ message: 'Not authenticated' });
    return res.redirect('/admin/login');
  }
};

module.exports = adminAuth;
