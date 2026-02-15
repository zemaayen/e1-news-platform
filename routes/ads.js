const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get all ads (superadmin only)
router.get('/', authenticateToken, authorize('superadmin'), (req, res) => {
    const ads = db.getAllAds(req.query);
    res.json({ ads });
});

// Get active ad by space (public)
router.get('/active/:adSpace', (req, res) => {
    const ad = db.getActiveAdBySpace(req.params.adSpace);
    if (ad) {
        // Increment view count
        db.incrementAdViews(ad.id);
    }
    res.json({ ad });
});

// Get single ad by ID (superadmin only)
router.get('/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    const ad = db.getAdById(req.params.id);
    if (!ad) {
        return res.status(404).json({ error: 'Ad not found' });
    }
    res.json({ ad });
});

// Create new ad (superadmin only)
router.post('/', authenticateToken, authorize('superadmin'), (req, res) => {
    try {
        const { name, adSpace, mediaType, mediaUrl, htmlContent, linkUrl, isActive, startDate, endDate } = req.body;
        
        if (!name || !adSpace || !mediaType) {
            return res.status(400).json({ error: 'Name, ad space, and media type are required' });
        }
        
        // Validate adSpace - must be string or non-empty array
        if (Array.isArray(adSpace)) {
            if (adSpace.length === 0) {
                return res.status(400).json({ error: 'At least one ad space must be selected' });
            }
        }
        
        const ad = db.createAd({
            name,
            adSpace, // Can now be string or array
            mediaType,
            mediaUrl: mediaUrl || null,
            htmlContent: htmlContent || null,
            linkUrl: linkUrl || null,
            isActive: isActive !== undefined ? isActive : true,
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: endDate ? new Date(endDate) : null,
            createdBy: req.user.id
        });
        
        res.status(201).json({ message: 'Ad created successfully', ad });
    } catch (error) {
        console.error('Error creating ad:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update ad (superadmin only)
router.put('/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    try {
        const { name, adSpace, mediaType, mediaUrl, htmlContent, linkUrl, isActive, startDate, endDate } = req.body;
        
        const ad = db.updateAd(req.params.id, {
            name,
            adSpace,
            mediaType,
            mediaUrl,
            htmlContent,
            linkUrl,
            isActive,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });
        
        if (!ad) {
            return res.status(404).json({ error: 'Ad not found' });
        }
        
        res.json({ message: 'Ad updated successfully', ad });
    } catch (error) {
        console.error('Error updating ad:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete ad (superadmin only)
router.delete('/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    const success = db.deleteAd(req.params.id);
    if (!success) {
        return res.status(404).json({ error: 'Ad not found' });
    }
    res.json({ message: 'Ad deleted successfully' });
});

// Track ad click (public)
router.post('/:id/click', (req, res) => {
    const success = db.incrementAdClicks(req.params.id);
    if (!success) {
        return res.status(404).json({ error: 'Ad not found' });
    }
    res.json({ message: 'Click tracked' });
});

module.exports = router;
