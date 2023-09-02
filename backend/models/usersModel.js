// usersModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  teamNumber: {
    type: String,
    required: true,
    unique: true
  },
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
    required: true
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  // other user properties
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Team: mongoose.model('Team', teamSchema)
};
