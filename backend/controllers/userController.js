// userController.js
const mongoose = require("mongoose");
const { User, Team } = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// private key
require("dotenv").config({ path: __dirname + "/../.env" });
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// User and Admin Create/signup
exports.userSignup = async (req, res, next) => {
  const { name, email, password, role, team } = req.body;
  const hashed = bcrypt.hashSync(password, 8); // Hash the password

  try {
    const user = await User.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
      team,
    });

    res.json({ success: true, data: user });
  } catch (error) {
    return res.json({ success: false, data: error.message });
  }
};

// User and Admin login
exports.login = async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("user", user);
    if (!user) {
      return next(new Error("User email address not found"));
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.json("Invalid Password");
    }

    const tokenPayload = {
      userId: user._id,
      role: user.role,
    };

    if (user.team) {
      tokenPayload.teamId = user.team._id;
      const token = jwt.sign(tokenPayload, PRIVATE_KEY);
      res.json({
        success: true,
        data: token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          team: user.team._id,
        },
      });
    } else {
      const token = jwt.sign(tokenPayload, PRIVATE_KEY);
      res.json({
        success: true,
        data: token,
        user: { name: user.name, email: user.email, role: user.role },
      });
    }

    // return token;
  } catch (error) {
    console.log("not found");
    next(new Error("Invalid user email address"));
  }
};

// Update Users and Admins
exports.updateUser = async (req, res) => {
  try {
    const { name, password, role, team } = req.body;
    const email = req.body.email.toLowerCase();

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log(user);
    if (!user) {
      res
        .status(404)
        .send({ success: false, message: "User email address not found" });
    }

    if (password) {
      password = bcrypt.hashSync(password, 8); // Hash the new password
    } else {
      password = user.password; // Keep the old password of user
    }

    const userObj = { name, email, password, role, team };
    const updateUser = await User.updateOne(
      {
        email: userObj.email, // search users collection for email of user to update
        $or: [
          { name: { $ne: userObj.name } },
          { email: { $ne: userObj.email } },
          { password: { $ne: userObj.password } },
          { role: { $ne: userObj.role } },
          { team: { $ne: userObj.team } },
        ],
      },
      {
        $set: userObj, // update the user object
      }
    );
    console.log(updateUser);
    res.status(200).json({ success: true, data: updateUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let { id } = req.params;
    console.log('Deleting user with ID:', id); // Add this line
    const user = await User
    .deleteOne({ _id: id }  )
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error deleting user:', error); // Add this line
    return res.json({ success: false, data: error });
  }
};


// GET all Users and Admins
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.json({ success: true, data: users });
  } catch (error) {
    return res.json({ success: false, data: error });
  }
};

// User and Admin logout
exports.userLogout = async (req, res, next) => {
  // implementation
};

// --------------------------------     Teams     --------------------------------//

// Team related endpoints
exports.createTeam = async (req, res, next) => {
  try {
    const { name, tarcTeamNumber } = req.body;
    const team = await Team.create({ name, tarcTeamNumber });
    console.log(team);
    res.json({ success: true, data: team });
  } catch (error) {
    return res.json({ success: false, data: error.message });
  }
};

exports.getTeams = async (req, res, next) => {};

exports.getTeamById = async (req, res) => {
  try {
    const teamId = req.params.id; // Assuming the team ID is passed in the URL
    const team = await Team.findById(teamId);
    console.log(team);
    res.status(200).json({
      status: "success",
      data: {
        team,
      },
    });
  } catch (error) {
    return res.json({ success: false, data: error.message });
  }
};

// Get all members of a specific team
exports.getTeamMembers = async (req, res) => {
  try {
    const teamId = req.params.teamId; // Assuming the team ID is passed in the URL

    const members = await User.find({ team: teamId })
      .populate("team") // Optionally populate the team info
      .exec();

    res.status(200).json({
      status: "success",
      data: {
        members,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateTeam = async (req, res, next) => {
  // implementation
};

// delete a team by team._id
exports.deleteTeam = async (req, res, next) => {
  const teamId = req.params.id; // Note: Using 'id' instead of 'teamId'

  try {
    const team = await Team.findByIdAndDelete(teamId);

    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// In a userController file
exports.updateUserTeam = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming user ID is passed in the URL
    const teamId = req.body.team; // Assuming the team's _id is sent as 'team'

    // Find the user and update the team
    const user = await User.findByIdAndUpdate(
      userId,
      { team: teamId },
      { new: true }
    )
      .populate("team") // Optionally populate the team info
      .exec();

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
