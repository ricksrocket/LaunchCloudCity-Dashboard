// authFlysheets.js
const { Flysheet } = require("../models/flysheetModels");
const mongoose = require("mongoose");

const authFlysheets = (req, res, next) => {
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

module.exports = authFlysheets;


