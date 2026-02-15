const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all tags
router.get('/', (req, res) => {
    try {
        const tags = db.getAllTags();
        res.json({ tags });
    } catch (error) {
        console.error('Error getting tags:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get popular tags
router.get('/popular', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const tags = db.getPopularTags(limit);
        res.json({ tags });
    } catch (error) {
        console.error('Error getting popular tags:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get articles by tag
router.get('/:tag/articles', (req, res) => {
    try {
        const articles = db.getArticlesByTag(req.params.tag);
        res.json({ articles });
    } catch (error) {
        console.error('Error getting articles by tag:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
