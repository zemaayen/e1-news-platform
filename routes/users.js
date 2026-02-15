const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get all users (superadmin only)
router.get('/', authenticateToken, authorize('superadmin'), (req, res) => {
    const users = db.getAllUsers();
    res.json({ users });
});

// Create user (superadmin only)
router.post('/', authenticateToken, authorize('superadmin'), async (req, res) => {
    try {
        const { username, email, password, role, fullName, profilePicture } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = db.createUser({ 
            username, 
            email, 
            password: hashedPassword, 
            role,
            fullName: fullName || username,
            profilePicture: profilePicture || null
        });
        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user (superadmin only)
router.put('/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    const user = db.updateUser(parseInt(req.params.id), req.body);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated', user });
});

// Delete user (superadmin only)
router.delete('/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    const success = db.deleteUser(parseInt(req.params.id));
    if (!success) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
});

module.exports = router;
