// server.js
const express = require("express");
const userRouter = require("./routes/userRouter");
const flightRouter = require("./routes/flightRouter");
const flysheetRouter = require("./routes/flysheetRouter");
const { validateUser } = require('./middleware/auth');

require("dotenv").config();
const port = 8000;
const cors = require("cors");

// create the server
const server = express();

// middleware body-parser for the entire app
server.use(express.json());
// cors
server.use(cors());

// routes flysheetRouter
server.use("/users", userRouter);
server.use("/flights", flightRouter);
server.use("/flysheets", validateUser, flysheetRouter);
// server.use("/checklists", checklistsRouter); TODO

// test server
server.get('/', async (req, res) => {
res.json("Hello Mate!")
});

// db connection
const connectDB = require("./database/connectionDB");
connectDB();

// not found handler
server.use((req, res, next) => {
    res.status(404).send("Route not found");
});

// specific error handler
server.use((error, req, res, next) => {
    if (error && error.message) {
        res.status(500).send(error.message);
    } else {
        next(); // pass to the next handler if no error.message
    }
});

// generic error handler
server.use((req, res, next) => {
    res.status(500).send("API not supported");
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
