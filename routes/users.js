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
router.put('/:id', authenticateToken, authorize('superadmin'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Hash password if provided
        if (updateData.password && updateData.password.trim() !== '') {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        } else {
            // Don't update password if empty
            delete updateData.password;
        }
        
        // Check if username is being changed and if it's already taken
        if (updateData.username) {
            const existingUser = db.getUserByUsername(updateData.username);
            const currentUser = db.getUserById(parseInt(req.params.id));
            if (existingUser && existingUser.id !== currentUser.id) {
                return res.status(400).json({ error: 'Username already taken' });
            }
        }
        
        const user = db.updateUser(parseInt(req.params.id), updateData);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User updated', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
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
