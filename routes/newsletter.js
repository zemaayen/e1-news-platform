const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorize } = require('../middleware/auth');

// Subscribe to newsletter (public)
router.post('/subscribe', async (req, res) => {
    try {
        const { email, daily = true, breaking = true } = req.body;
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Valid email is required' });
        }
        
        const subscription = db.subscribeNewsletter({ email, daily, breaking });
        res.json({ message: 'Successfully subscribed to newsletter', subscription });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Unsubscribe from newsletter (public)
router.post('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        const success = db.unsubscribeNewsletter(email);
        if (!success) {
            return res.status(404).json({ error: 'Subscription not found' });
        }
        
        res.json({ message: 'Successfully unsubscribed from newsletter' });
    } catch (error) {
        console.error('Error unsubscribing from newsletter:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all subscribers (superadmin only)
router.get('/subscribers', authenticateToken, authorize('superadmin'), async (req, res) => {
    try {
        const filters = {};
        if (req.query.active) filters.active = req.query.active === 'true';
        if (req.query.daily) filters.daily = req.query.daily === 'true';
        if (req.query.breaking) filters.breaking = req.query.breaking === 'true';
        
        const subscribers = db.getAllNewsletterSubscribers(filters);
        res.json({ subscribers, total: subscribers.length });
    } catch (error) {
        console.error('Error fetching newsletter subscribers:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
