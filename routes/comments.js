const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Get comments for article
router.get('/articles/:id/comments', (req, res) => {
    const comments = db.getCommentsByArticleId(req.params.id);
    res.json({ comments });
});

// Post comment (public - no auth required)
router.post('/articles/:id/comments', (req, res) => {
    const { content, username } = req.body;
    
    // Use provided username or "Anonymous" if not provided
    const commentUsername = username && username.trim() ? username.trim() : 'Anonymous';
    
    const comment = db.createComment({
        articleId: parseInt(req.params.id),
        userId: null, // No user ID for anonymous comments
        username: commentUsername,
        content
    });
    res.status(201).json({ message: 'Comment posted', comment });
});

// Delete comment (superadmin or own comment)
router.delete('/comments/:id', authenticateToken, (req, res) => {
    const comment = db.comments.find(c => c.id === parseInt(req.params.id));
    if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    if (req.user.role !== 'superadmin' && comment.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
    }

    db.deleteComment(req.params.id);
    res.json({ message: 'Comment deleted' });
});

module.exports = router;
