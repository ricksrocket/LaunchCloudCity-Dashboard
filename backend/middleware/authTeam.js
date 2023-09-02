const jwt = require('jsonwebtoken');
const PRIVATE_KEY = process.env.PRIVATE_KEY;

exports.authTeam = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, PRIVATE_KEY);
    const teamId = decodedToken.teamId;
    const role = decodedToken.role;
    console.log('teamId', teamId);
    console.log('decodedToken', decodedToken) 

    // Attach the teamId to the req object
    req.teamId = teamId;

    // Allow admins to access any team's flysheets
    if (role === 'admin') {
      return next();
    }

    // Non-admin users can only access their own team's flysheets
    if (req.params.teamId && req.params.teamId !== teamId) {
      throw new Error("Unauthorized");
    }
    
    next();
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!")
    });
  }
};
