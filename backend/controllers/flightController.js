// flightController.js
const mongoose = require("mongoose");
const { Parachute } = require("../models/parachuteModel");

// Checklist related methods
// flightController.js
const { Checklist } = require("../models/flysheetModels");

// Create a new checklist
exports.createChecklist = async (req, res) => {
  try {
    const checklistData = req.body;
    console.log("checklistData", checklistData); // Assuming the request body contains the checklist data
    const newChecklist = await Checklist.create(checklistData);

    res.status(201).json({ success: true, data: newChecklist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all checklists

// Get all checklists
exports.getChecklists = async (req, res) => {
  try {
    const checklists = await Checklist.find();

    res.status(200).json({ success: true, data: checklists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific checklist by ID
exports.getChecklistById = async (req, res) => {
  try {
    const checklistId = req.params.id;
    const checklist = await Checklist.findById(checklistId);
    if (!checklist) {
      return res.status(404).json({ error: "Checklist not found" });
    }
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch checklist" });
  }
};

// Update a checklist by ID
exports.updateChecklist = async (req, res) => {
  try {
    const checklistId = req.params.id;
    const checklistData = req.body; // Assuming the request body contains the updated checklist data
    const updatedChecklist = await Checklist.findByIdAndUpdate(
      checklistId,
      checklistData,
      { new: true }
    );
    if (!updatedChecklist) {
      return res.status(404).json({ error: "Checklist not found" });
    }
    res.json(updatedChecklist);
  } catch (error) {
    res.status(500).json({ error: "Failed to update checklist" });
  }
};

// Delete a checklist by ID
exports.deleteChecklist = async (req, res) => {
  try {
    const checklistId = req.params.id;
    const deletedChecklist = await Checklist.findByIdAndDelete(checklistId);
    if (!deletedChecklist) {
      return res.status(404).json({ error: "Checklist not found" });
    }
    res.json({ message: "Checklist deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete checklist" });
  }
};

// Flight related methods
exports.createFlight = async (req, res) => {
  // TODO: Implementation
  res.send("createFlight endpoint hit");
};

exports.getFlights = async (req, res) => {
  // TODO: Implementation
  res.send("getFlights endpoint hit");
};

exports.getFlightById = async (req, res) => {
  // TODO: Implementation
  res.send("getFlightById endpoint hit");
};

exports.updateFlight = async (req, res) => {
  // TODO: Implementation
  res.send("updateFlight endpoint hit");
};

exports.deleteFlight = async (req, res) => {
  // TODO: Implementation
  res.send("deleteFlight endpoint hit");
};

//  --------------------------     Parachute CRUD methods     --------------------------   //

// add a parachute to the database
exports.createParachute = async (req, res) => {
  const { shape, area, reefed, spillHole } = req.body;

  try {
    const chute = await Parachute.create({
      _id: new mongoose.Types.ObjectId(),
      shape,
      area,
      reefed,
      spillHole,
    });

    res.json({ success: true, data: chute });
  } catch (error) {
    return res.json({ success: false, data: error.message });
  }
};

exports.getParachutes = async (req, res) => {
  try {
    const chutes = await Parachute.find().sort({ area: -1 });

    res.json({ success: true, data: chutes });
  } catch (error) {
    return res.json({ success: false, data: error.message });
  }
};

exports.getParachuteById = async (req, res) => {
  const { id } = req.params;
  console.log("id:", id);

  try {
    const chute = await Parachute.findById(id);
    console.log("chute:", chute);

    // if not chute found
    if (!chute) {
      return res
        .status(404)
        .json({ success: false, message: "No parachute found with this id" });
    }
    res.json({ success: true, data: chute });
  } catch (error) {
    return res.json({ success: false, data: error.message });
  }
};

exports.updateParachute = async (req, res) => {
  const { id } = req.params;
  const { shape, area, reefed, spillHole } = req.body;

  try {
    const chute = await Parachute.findByIdAndUpdate(
      id, // find a document by id
      { $set: { shape, area, reefed, spillHole } }, // set new values for the document
      { new: true } // option to return the updated document
    );

    if (!chute) {
      return res
        .status(404)
        .json({ success: false, message: "No parachute found with this id" });
    }

    res.json({ success: true, data: chute });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  delete parachute by id
exports.deleteParachute = async (req, res) => {
  const { id } = req.params;
  console.log("id:", id);
  try {
    const DBresp = await Parachute.deleteOne({ _id: id });
    console.log("DBresp:", DBresp);

    if (!DBresp) {
      return res
        .status(404)
        .json({ success: false, message: "No parachute found with this id" });
    }

    res.json({ success: true, data: DBresp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
