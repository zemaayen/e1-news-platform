const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get stats (reporter, superadmin)
router.get('/', authenticateToken, authorize('superadmin', 'reporter'), (req, res) => {
    const stats = db.getStats();
    res.json({ stats });
});

module.exports = router;
