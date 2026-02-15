const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get settings (public)
router.get('/', (req, res) => {
    const settings = db.getSettings();
    res.json({ settings });
});

// Update settings (superadmin only)
router.put('/', authenticateToken, authorize('superadmin'), (req, res) => {
    const settings = db.updateSettings(req.body);
    res.json({ message: 'Settings updated', settings });
});

module.exports = router;
