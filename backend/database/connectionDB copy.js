// connectionDB.js
const mongoose = require('mongoose');

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/CS566'; // Fallback to localhost if no env variable

async function connectDB() {
    try {
        const con = await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${con.connection.host}:${con.connection.port}`);
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
}

module.exports = connectDB;
