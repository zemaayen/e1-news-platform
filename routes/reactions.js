const express = require('express');
const router = express.Router();
const db = require('../database');

// Get reactions for an article
router.get('/articles/:id/reactions', (req, res) => {
    const counts = db.getReactionCounts(req.params.id);
    res.json({ reactions: counts });
});

// Get user's reaction for an article (public - uses sessionId)
router.get('/articles/:id/reactions/me', (req, res) => {
    const sessionId = req.query.sessionId;
    
    if (!sessionId) {
        return res.json({ reaction: null });
    }
    
    const userReaction = db.getUserReaction(req.params.id, sessionId);
    res.json({ reaction: userReaction ? userReaction.type : null });
});

// Add or update reaction (public - no auth required)
router.post('/articles/:id/reactions', (req, res) => {
    const { type, sessionId } = req.body; // 'like' or 'dislike'
    
    if (!['like', 'dislike'].includes(type)) {
        return res.status(400).json({ error: 'Invalid reaction type' });
    }
    
    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required' });
    }

    const result = db.addOrUpdateReaction(req.params.id, sessionId, type);
    const counts = db.getReactionCounts(req.params.id);
    
    res.json({ 
        message: `Reaction ${result.action}`,
        action: result.action,
        type: result.type,
        reactions: counts
    });
});

module.exports = router;
