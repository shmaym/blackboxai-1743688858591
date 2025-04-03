// Mock data (replace with database in production)
let appointments = [
    {
        id: 1,
        clientId: 1,
        clientName: 'John Smith',
        clientEmail: 'john@example.com',
        staffId: 1,
        staffName: 'Dr. Sarah Johnson',
        staffRole: 'Cardiologist',
        date: '2023-10-25',
        time: '10:00',
        status: 'scheduled',
        notes: 'Regular checkup'
    }
];

// Get all appointments
const getAllAppointments = async (req, res) => {
    try {
        // In production, fetch from database with pagination
        res.json({
            success: true,
            data: appointments
        });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments'
        });
    }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const appointment = appointments.find(a => a.id === parseInt(req.params.id));
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointment'
        });
    }
};

// Create new appointment
const createAppointment = async (req, res) => {
    try {
        const {
            clientId,
            clientName,
            clientEmail,
            staffId,
            staffName,
            staffRole,
            date,
            time,
            notes
        } = req.body;

        // Validate required fields
        if (!clientId || !staffId || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create new appointment
        const newAppointment = {
            id: appointments.length + 1,
            clientId,
            clientName,
            clientEmail,
            staffId,
            staffName,
            staffRole,
            date,
            time,
            status: 'scheduled',
            notes
        };

        // In production, save to database
        appointments.push(newAppointment);

        res.status(201).json({
            success: true,
            data: newAppointment
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating appointment'
        });
    }
};

// Update appointment
const updateAppointment = async (req, res) => {
    try {
        const appointmentId = parseInt(req.params.id);
        const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);

        if (appointmentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        const updatedAppointment = {
            ...appointments[appointmentIndex],
            ...req.body,
            id: appointmentId // Ensure ID doesn't change
        };

        // In production, update in database
        appointments[appointmentIndex] = updatedAppointment;

        res.json({
            success: true,
            data: updatedAppointment
        });
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating appointment'
        });
    }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
    try {
        const appointmentId = parseInt(req.params.id);
        const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);

        if (appointmentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // In production, soft delete in database
        appointments = appointments.filter(a => a.id !== appointmentId);

        res.json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting appointment'
        });
    }
};

// Get appointments by date range
const getAppointmentsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }

        // In production, query database with date range
        const filteredAppointments = appointments.filter(
            a => a.date >= startDate && a.date <= endDate
        );

        res.json({
            success: true,
            data: filteredAppointments
        });
    } catch (error) {
        console.error('Get appointments by date range error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments'
        });
    }
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDateRange
};