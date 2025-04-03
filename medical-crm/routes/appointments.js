const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all appointment routes
router.use(authMiddleware);

// Get all appointments
router.get('/', appointmentController.getAllAppointments);

// Get appointments by date range
router.get('/date-range', appointmentController.getAppointmentsByDateRange);

// Get specific appointment
router.get('/:id', appointmentController.getAppointmentById);

// Create new appointment
router.post('/', appointmentController.createAppointment);

// Update appointment
router.put('/:id', appointmentController.updateAppointment);

// Delete appointment
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;