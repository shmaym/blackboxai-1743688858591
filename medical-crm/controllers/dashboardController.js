// Import controllers (in production, these would be database queries)
const appointmentController = require('./appointmentController');
const clientController = require('./clientController');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Get today's date
        const today = new Date().toISOString().split('T')[0];
        
        // Get all appointments (in production, this would be optimized with specific queries)
        const appointmentsResponse = await appointmentController.getAllAppointments({}, { json: () => {} });
        const appointments = appointmentsResponse.data || [];

        // Get all clients
        const clientsResponse = await clientController.getAllClients({}, { json: () => {} });
        const clients = clientsResponse.data || [];

        // Calculate statistics
        const todayAppointments = appointments.filter(apt => apt.date === today);
        const pendingAppointments = appointments.filter(apt => apt.status === 'scheduled');
        const activeClients = clients.filter(client => client.status === 'active');
        const activeStaff = 5; // Mock data (in production, fetch from staff database)

        // Recent appointments (last 5)
        const recentAppointments = appointments
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        res.json({
            success: true,
            data: {
                stats: {
                    todayAppointments: todayAppointments.length,
                    totalClients: clients.length,
                    pendingAppointments: pendingAppointments.length,
                    activeStaff: activeStaff
                },
                recentAppointments: recentAppointments,
                // Add more dashboard data as needed
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics'
        });
    }
};

// Get appointments overview
const getAppointmentsOverview = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        // Get appointments within date range
        const appointmentsResponse = await appointmentController.getAppointmentsByDateRange(
            { query: { startDate, endDate } },
            { json: () => {} }
        );
        const appointments = appointmentsResponse.data || [];

        // Calculate statistics
        const appointmentsByStatus = {
            scheduled: appointments.filter(apt => apt.status === 'scheduled').length,
            completed: appointments.filter(apt => apt.status === 'completed').length,
            cancelled: appointments.filter(apt => apt.status === 'cancelled').length
        };

        // Group appointments by date
        const appointmentsByDate = appointments.reduce((acc, apt) => {
            acc[apt.date] = (acc[apt.date] || 0) + 1;
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                appointmentsByStatus,
                appointmentsByDate,
                totalAppointments: appointments.length
            }
        });
    } catch (error) {
        console.error('Get appointments overview error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments overview'
        });
    }
};

// Get client statistics
const getClientStats = async (req, res) => {
    try {
        // Get all clients
        const clientsResponse = await clientController.getAllClients({}, { json: () => {} });
        const clients = clientsResponse.data || [];

        // Calculate statistics
        const clientsByStatus = {
            active: clients.filter(client => client.status === 'active').length,
            inactive: clients.filter(client => client.status === 'inactive').length
        };

        // Get new clients this month
        const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const newClientsThisMonth = clients.filter(client => 
            client.createdAt.startsWith(thisMonth)
        ).length;

        res.json({
            success: true,
            data: {
                clientsByStatus,
                newClientsThisMonth,
                totalClients: clients.length
            }
        });
    } catch (error) {
        console.error('Get client stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching client statistics'
        });
    }
};

module.exports = {
    getDashboardStats,
    getAppointmentsOverview,
    getClientStats
};