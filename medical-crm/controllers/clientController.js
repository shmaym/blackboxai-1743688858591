// Mock data (replace with database in production)
let clients = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1 234 567 8900',
        dateOfBirth: '1980-05-15',
        address: '123 Main St, City, Country',
        medicalHistory: 'No major health issues',
        status: 'active',
        lastVisit: '2023-10-20',
        lastVisitType: 'Regular Checkup',
        createdAt: '2023-01-01'
    }
];

// Get all clients
const getAllClients = async (req, res) => {
    try {
        // In production, fetch from database with pagination
        res.json({
            success: true,
            data: clients
        });
    } catch (error) {
        console.error('Get clients error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching clients'
        });
    }
};

// Get client by ID
const getClientById = async (req, res) => {
    try {
        const client = clients.find(c => c.id === parseInt(req.params.id));
        
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.json({
            success: true,
            data: client
        });
    } catch (error) {
        console.error('Get client error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching client'
        });
    }
};

// Create new client
const createClient = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            dateOfBirth,
            address,
            medicalHistory
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if email already exists
        if (clients.some(c => c.email === email)) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create new client
        const newClient = {
            id: clients.length + 1,
            name,
            email,
            phone,
            dateOfBirth,
            address,
            medicalHistory,
            status: 'active',
            lastVisit: null,
            lastVisitType: null,
            createdAt: new Date().toISOString().split('T')[0]
        };

        // In production, save to database
        clients.push(newClient);

        res.status(201).json({
            success: true,
            data: newClient
        });
    } catch (error) {
        console.error('Create client error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating client'
        });
    }
};

// Update client
const updateClient = async (req, res) => {
    try {
        const clientId = parseInt(req.params.id);
        const clientIndex = clients.findIndex(c => c.id === clientId);

        if (clientIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Check if email is being changed and is unique
        if (req.body.email && req.body.email !== clients[clientIndex].email) {
            if (clients.some(c => c.email === req.body.email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }
        }

        const updatedClient = {
            ...clients[clientIndex],
            ...req.body,
            id: clientId // Ensure ID doesn't change
        };

        // In production, update in database
        clients[clientIndex] = updatedClient;

        res.json({
            success: true,
            data: updatedClient
        });
    } catch (error) {
        console.error('Update client error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating client'
        });
    }
};

// Delete client
const deleteClient = async (req, res) => {
    try {
        const clientId = parseInt(req.params.id);
        const clientIndex = clients.findIndex(c => c.id === clientId);

        if (clientIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // In production, soft delete in database
        clients = clients.filter(c => c.id !== clientId);

        res.json({
            success: true,
            message: 'Client deleted successfully'
        });
    } catch (error) {
        console.error('Delete client error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting client'
        });
    }
};

// Search clients
const searchClients = async (req, res) => {
    try {
        const { query, status } = req.query;
        let filteredClients = [...clients];

        if (query) {
            const searchQuery = query.toLowerCase();
            filteredClients = filteredClients.filter(client => 
                client.name.toLowerCase().includes(searchQuery) ||
                client.email.toLowerCase().includes(searchQuery) ||
                client.phone.includes(query)
            );
        }

        if (status) {
            filteredClients = filteredClients.filter(client => 
                client.status === status
            );
        }

        res.json({
            success: true,
            data: filteredClients
        });
    } catch (error) {
        console.error('Search clients error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching clients'
        });
    }
};

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    searchClients
};