const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get all articles (public)
router.get('/', (req, res) => {
    const { category, status } = req.query;
    const filters = {};
    
    if (category) filters.category = category;
    // Only show published articles to public
    filters.status = status || 'published';
    
    const articles = db.getAllArticles(filters);
    res.json({ articles });
});

// Get my articles (reporter)
router.get('/my', authenticateToken, authorize('reporter', 'superadmin'), (req, res) => {
    const articles = db.getAllArticles({ authorId: req.user.id });
    res.json({ articles });
});

// Get single article
router.get('/:id', (req, res) => {
    const article = db.getArticleById(req.params.id);
    if (!article) {
        return res.status(404).json({ error: 'Article not found' });
    }
    // Increment views
    db.incrementArticleViews(req.params.id);
    res.json({ article });
});

// Create article (reporter, superadmin)
router.post('/', authenticateToken, authorize('reporter', 'superadmin'), (req, res) => {
    try {
        const user = db.getUserById(req.user.id);
        const article = db.createArticle({
            ...req.body,
            author: user.username,
            authorId: req.user.id
        });
        res.status(201).json({ message: 'Article created', article });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update article (own articles for reporter, all for superadmin)
router.put('/:id', authenticateToken, authorize('reporter', 'superadmin'), (req, res) => {
    const article = db.getArticleById(req.params.id);
    if (!article) {
        return res.status(404).json({ error: 'Article not found' });
    }

    // Check if reporter owns the article
    if (req.user.role === 'reporter' && article.authorId !== req.user.id) {
        return res.status(403).json({ error: 'You can only edit your own articles' });
    }

    const updatedArticle = db.updateArticle(req.params.id, req.body);
    res.json({ message: 'Article updated', article: updatedArticle });
});

// Delete article (own articles for reporter, all for superadmin)
router.delete('/:id', authenticateToken, authorize('reporter', 'superadmin'), (req, res) => {
    const article = db.getArticleById(req.params.id);
    if (!article) {
        return res.status(404).json({ error: 'Article not found' });
    }

    if (req.user.role === 'reporter' && article.authorId !== req.user.id) {
        return res.status(403).json({ error: 'You can only delete your own articles' });
    }

    db.deleteArticle(req.params.id);
    res.json({ message: 'Article deleted' });
});

module.exports = router;
