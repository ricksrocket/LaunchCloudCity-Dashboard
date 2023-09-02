// isAdmin.js
const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

    // Check if the role is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Not an admin.' });
    }

    // If an admin, store the user info in the request and proceed
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid token.' });
  }
};

module.exports = isAdmin;
