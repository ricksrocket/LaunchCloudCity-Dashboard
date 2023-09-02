// userRouter.js
const express = require("express");
const userController = require("../controllers/userController");
const isAdmin = require("../middleware/isAdmin");

// create router
const userRouter = express.Router();

// User and Admin related routes
userRouter.post("/login", userController.login); //
userRouter.post("/logout", userController.userLogout); //
userRouter.post("/signup", isAdmin, userController.userSignup); //

// CRUD for Users
userRouter.get("/", isAdmin, userController.getAllUsers);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", isAdmin, userController.deleteUser);

// Team related routes
userRouter.post("/teams", userController.createTeam);
userRouter.get("/teams", isAdmin, userController.getTeams);
userRouter.get("/teams/:id", userController.getTeamById);
userRouter.put("/teams/:id", isAdmin, userController.updateTeam);
userRouter.put("/teams/:id/team", userController.updateUserTeam);
userRouter.delete("/teams/:id", isAdmin, userController.deleteTeam);

module.exports = userRouter;
