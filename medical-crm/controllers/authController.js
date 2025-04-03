const jwt = require('jsonwebtoken');

// Mock user data (replace with database in production)
const users = [
    {
        id: 1,
        email: 'admin@example.com',
        password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDOMJVF7/oY2', // 'password123'
        name: 'Admin User',
        role: 'admin'
    }
];

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // In production, validate against database
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // In production, use bcrypt.compare to check password
        if (password !== 'password123') {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during login'
        });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

const getCurrentUser = (req, res) => {
    try {
        const user = req.user; // Set by authMiddleware
        res.json({
            success: true,
            user: {
                id: user.userId,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching user data'
        });
    }
};

module.exports = {
    login,
    logout,
    getCurrentUser
};