// parachuteModel.js
const mongoose = require("mongoose");

const ParachuteSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  shape: {
    type: String,
    enum: ["round", "hexagon", "octagon"],
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  reefed: {
    type: Boolean,
    default: false,
  },
  spillHole: {
    type: Boolean,
    default: false,
  },
});

module.exports = {
  Parachute: mongoose.model("Parachute", ParachuteSchema),
};
