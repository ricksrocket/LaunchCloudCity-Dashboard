// flysheetRouter.js
const express = require("express");
const flysheetRouter = express.Router();
const flysheetController = require("../controllers/flysheetController");
const { authTeam } = require("../middleware/authTeam");
const { validateUser } = require("../middleware/auth");

// weather API
flysheetRouter.get(
  "/weather/:latitude/:longitude",
  flysheetController.getWeather
);

// Flysheets
flysheetRouter.post("/", flysheetController.createFlysheet); // tested passed
//

// Flysheets
flysheetRouter.post("/", authTeam, flysheetController.createFlysheet); // Apply validateUser middleware if needed
flysheetRouter.get("/", authTeam, flysheetController.getFlysheets); // Apply validateUser middleware if needed
flysheetRouter.get("/:id", authTeam, flysheetController.getFlysheetById); // Apply validateUser middleware if needed
flysheetRouter.put("/:id", authTeam, flysheetController.updateFlysheet); // Apply both validateUser and authTeam middleware
flysheetRouter.delete("/:id", authTeam, flysheetController.deleteFlysheet); // Apply both validateUser and authTeam middleware

module.exports = flysheetRouter;
