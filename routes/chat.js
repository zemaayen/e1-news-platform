const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get all chat messages (public)
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const messages = db.getRecentChatMessages(limit);
    res.json({ messages });
});

// Create chat message (reporters and superadmin only)
router.post('/', authenticateToken, authorize('reporter', 'superadmin'), (req, res) => {
    try {
        const { message, mediaType, mediaUrl } = req.body;
        
        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }
        
        // Get user details
        const user = db.getUserById(req.user.id);
        const userFullName = user.fullName || (user.email ? user.email.split('@')[0] : req.user.username);
        
        const chatMessage = db.createChatMessage({
            userId: req.user.id,
            username: req.user.username,
            userRole: req.user.role,
            userFullName: userFullName,
            profilePicture: user.profilePicture || null,
            message: message.trim(),
            mediaType: mediaType || null,
            mediaUrl: mediaUrl || null
        });
        
        res.status(201).json({ message: 'Chat message created', chatMessage });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete chat message (superadmin only)
router.delete('/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    const success = db.deleteChatMessage(parseInt(req.params.id));
    if (!success) {
        return res.status(404).json({ error: 'Chat message not found' });
    }
    res.json({ message: 'Chat message deleted' });
});

module.exports = router;
