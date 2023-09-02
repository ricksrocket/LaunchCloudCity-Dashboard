// flysheetsMiddleware.js
const jwt = require('jsonwebtoken');
const { Flysheet } = require("../models/flysheetModels");
const mongoose = require("mongoose");
const PRIVATE_KEY = process.env.PRIVATE_KEY;

exports.authTeam = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, PRIVATE_KEY);
    const teamId = decodedToken.teamId;
    const role = decodedToken.role;

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

exports.authFlysheets = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }

  // Retrieve the user's team ID from the decoded JWT payload (should be a string)
  const userTeamId = req.user.teamId;

  // Retrieve the requested flysheet's ID
  const flysheetId = req.params.id;

  Flysheet.findById(flysheetId, (err, flysheet) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server Error" });
    }

    // Ensure that the flysheet exists and the team IDs match
    if (!flysheet || flysheet.teamId.toString() !== userTeamId) {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    // Continue with the request
    next();
  });
};
