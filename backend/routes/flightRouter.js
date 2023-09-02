// flightRouter.js
const express = require('express');
const flightRouter = express.Router();

// Assuming we have a flightController object with our controller methods
const flightController = require('../controllers/flightController');

// Checklist related routes
flightRouter.post('/checklists', flightController.createChecklist);
flightRouter.get('/checklists', flightController.getChecklists);
flightRouter.get('/checklists/:id', flightController.getChecklistById);
flightRouter.put('/checklists/:id', flightController.updateChecklist);
flightRouter.delete('/checklists/:id', flightController.deleteChecklist);

// Parachute related routes - ALL Routes Tested in this block
flightRouter.post('/parachutes', flightController.createParachute);
flightRouter.get('/parachutes', flightController.getParachutes);
flightRouter.get('/parachutes/:id', flightController.getParachuteById);
flightRouter.put('/parachutes/:id', flightController.updateParachute);
flightRouter.delete('/parachutes/:id', flightController.deleteParachute);

// Flight related routes
flightRouter.post('/', flightController.createFlight);
flightRouter.get('/', flightController.getFlights);
flightRouter.get('/:id', flightController.getFlightById);
flightRouter.put('/:id', flightController.updateFlight);
flightRouter.delete('/:id', flightController.deleteFlight);

module.exports = flightRouter;
