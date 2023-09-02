// flysheetModels.js
const mongoose = require("mongoose");

const preFlightSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  timeOfLaunch: {
    type: Date,
    required: false,
  },
  location: {
    type: String,
    default: "Fairfield, IA",
  },
  elevationOfLaunchSite: {
    type: Number,
    default: 774,
  },
  weatherConditions: {
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    atmosphericPressure: {
      type: Number,
      required: true,
    },
    airDensity: Number,
    windSpeedDirection: {
      type: Number,
      default: 1.225,
      required: true,
    },
    windSpeed: Number,
  },
  rocketInformation: {
    motorUsed: {
      type: String,
      default: "F39-7",
    },
    motorSerialNumber: String,
    motorTotalImpulse: {
      type: Number,
      default: 49.7,
    },
    payloadMass: {
      type: Number,
      required: false,
    },
    liftoffMass: {
      type: Number,
      required: true,
    },
    parachuteAreaPayload: Number,
    parachuteAreaBooster: {
      type: Number,
      required: true,
    },
    targetApogee: {
      type: Number,
      required: true,
    },
    predictedDuration: Number,
    centerOfPressure: Number,
    centerOfGravity: Number,
    staticStabilityMargin: {
      type: Number,
      required: true,
    },
  },
  launchInformation: {
    railLength: {
      type: Number,
      default: 2.4382,
      required: true,
    },
    launchAngleDownwind: {
      type: Number,
      default: 1.0,
      required: true,
    },
    launchAnglePerpendicular: {
      type: Number,
      default: 0.0,
      required: true,
    },
    tarcAltimeterModel: {
      type: String,
      default: "PNUT",
    },
    tarcAltimeterSerialNumber: String,
  },
});

const postFlightSchema = new mongoose.Schema({
  contestAltimeterApogee: {
    type: Number,
    required: true,
  },
  timer1Duration: {
    type: Number,
    required: true,
  },
  timer2Duration: {
    type: Number,
    required: true,
  },
  avgDuration: Number,
  tarcScores: {
    altitudeScore: Number,
    durationScore: Number,
    totalScore: Number,
  },
  flightComputerData: {
    initialTheta: Number,
    initialPhi: Number,
    maxSpeed: Number,
    maxGForce: Number,
    timeBurnout: Number,
    timeToApogee: Number,
    computerAltimeterApogee: Number,
  },
});

const flysheetSchema = new mongoose.Schema({
  rocketTeamName: {
    type: String,
    required: false,
  },
  flightNumber: {
    type: Number,
    unique: false,
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  preFlight: preFlightSchema,
  postFlight: postFlightSchema,
  countdownChecklist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Checklist",
  },
});

const Flysheet = mongoose.model("Flysheet", flysheetSchema);

// checklists
const checklistItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  description: { type: String, required: true },
  responsible:  { type: String, required: true },
  isChecked: {
    type: Boolean,
    default: false,
    required: true,
  },
  isCritical: {
    type: Boolean,
    default: true,
  }
});

const checklistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [checklistItemSchema],
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  flysheetIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flysheet",
  }],
});


const Checklist = mongoose.model("Checklist", checklistSchema);

module.exports = { Flysheet, Checklist };