// connectionDB.js
const mongoose = require('mongoose');
const winston = require('winston');

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/CS566'; 

async function connectDB() {
    try {
        console.log('Attempting to connect to MongoDB...'); // Standard console logging for immediate feedback
        const con = await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${con.connection.host}:${con.connection.port}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error); // Immediate feedback on console
        winston.error('Error connecting to MongoDB:', error); // Log the error using winston for persistent logging
    }
}

module.exports = connectDB;
