const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all dashboard routes
router.use(authMiddleware);

// Get dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

// Get appointments overview
router.get('/appointments-overview', dashboardController.getAppointmentsOverview);

// Get client statistics
router.get('/client-stats', dashboardController.getClientStats);

module.exports = router;