const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all client routes
router.use(authMiddleware);

// Get all clients
router.get('/', clientController.getAllClients);

// Search clients
router.get('/search', clientController.searchClients);

// Get specific client
router.get('/:id', clientController.getClientById);

// Create new client
router.post('/', clientController.createClient);

// Update client
router.put('/:id', clientController.updateClient);

// Delete client
router.delete('/:id', clientController.deleteClient);

module.exports = router;