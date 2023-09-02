// flysheetController.js
const mongoose = require("mongoose");
const { Flysheet, Checklist } = require("../models/flysheetModels");
// weather related imports
const axios = require('axios');

// weather related methods
exports.getWeather = async (req, res) => {
  const { latitude, longitude } = req.params;

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`);
  
    if (!response.status === 200) {
      throw new Error('Network response was not ok');
    }
  
    const data = response.data;
    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.createFlysheet = async (req, res) => {
  try {
    console.log("req.body.teamId:", req.body.teamId);
    const flysheetData = req.body;

    // Ensure countdownChecklist is a valid ObjectId before creating the Flysheet
    if (!mongoose.isValidObjectId(flysheetData.countdownChecklist)) {
      throw new Error("Invalid ObjectId for countdownChecklist");
    }

    // Create the Flysheet
    const flysheet = new Flysheet(flysheetData);
    const savedFlysheet = await flysheet.save();

    res.status(201).json({ success: true, message: "Flysheet created successfully" });
  } catch (error) {
    console.error("Error creating flysheet:", error);
    res.status(500).json({ success: false, error: "Error creating flysheet" });
  }
};


// flysheetController.js
exports.getFlysheets = async (req, res) => {
  try {
    console.log("req.teamId:", req.teamId);
    // Retrieve the user's team ID from the req object
    const userTeamId = req.teamId;

    // Query the database to get flysheets
    let flysheets;
    if (userTeamId) {
      // If userTeamId exists (non-admin user), filter flysheets by teamId
      flysheets = await Flysheet.find({ teamId: userTeamId });
    } else {
      // If userTeamId is null (admin user), retrieve all flysheets
      flysheets = await Flysheet.find();
    }

    res.status(200).json({ success: true, data: flysheets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getFlysheetById = async (req, res) => {
  try {
    const flysheet = await Flysheet.findById(req.params.id).populate(
      "countdownChecklist"
    );
    if (!flysheet) {
      return res
        .status(404)
        .json({ success: false, message: "No flysheet found with this id" });
    }
    res.status(200).json({ success: true, data: flysheet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFlysheet = async (req, res) => {
  try {
    console.log(req.params.id)
    const flysheet = await Flysheet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("countdownChecklist");
    if (!flysheet) {
      return res
        .status(404)
        .json({ success: false, message: "No flysheet found with this id" });
    }
    res.status(200).json({ success: true, data: flysheet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFlysheet = async (req, res) => {
  try {
    const flysheet = await Flysheet.findById(req.params.id);
    if (!flysheet) {
      return res
        .status(404)
        .json({ success: false, message: "No flysheet found with this id" });
    }
    // Delete associated checklist
    await Checklist.findByIdAndDelete(flysheet.countdownChecklist);

    await flysheet.deleteOne();
    // await Flysheet.findByIdAndDelete(req.params.id);
    // await Flysheet.findByIdAndDelete(req.params.id, req.body, { new: true }; // or use Flysheet.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, data: flysheet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
