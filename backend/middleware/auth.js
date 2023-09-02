// auth.js
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: __dirname + "/../.env" });

exports.validateUser = (req, res, next) => {
    if (req.headers.authorization) {
        const arr = req.headers.authorization.split(' ');
        if (arr.length === 2) {
            const token = arr[1];
            try {
                const verified = jwt.verify(token, process.env.PRIVATE_KEY);
                if (verified) {
                    next();
                    return; // Exit the middleware after calling next()
                }
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    res.send({ success: false, message: 'Token has expired' });
                } else if (error.name === 'JsonWebTokenError') {
                    res.send({ success: false, message: 'Invalid token' });
                } else {
                    res.send({ success: false, message: 'Unexpected error' });
                }
                return;
            }
        } else {
            res.send({ success: false, message: 'Please send token in Bearer schema format' });
            return; // Exit the middleware after sending the response
        }
    }
    res.send({ success: false, message: 'Please send token in headers' });
};
