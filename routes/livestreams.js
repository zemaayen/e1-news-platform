const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorize } = require('../middleware/auth');

// Get all live streams
router.get('/', (req, res) => {
    try {
        const streams = db.getAllLiveStreams(req.query);
        res.json({ liveStreams: streams });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single live stream by ID
router.get('/:id', (req, res) => {
    try {
        const stream = db.getLiveStreamById(req.params.id);
        if (!stream) {
            return res.status(404).json({ error: 'Live stream not found' });
        }
        res.json({ liveStream: stream });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new live stream (superadmin only)
router.post('/', authenticateToken, authorize('superadmin'), (req, res) => {
    try {
        const {
            streamUrl,
            viewerCount,
            startTime,
            status
        } = req.body;
        
        if (!streamUrl) {
            return res.status(400).json({ error: 'Stream URL is required' });
        }
        
        const liveStream = db.createLiveStream({
            streamUrl,
            viewerCount: viewerCount || 0,
            startTime: startTime || null,
            status: status || 'active'
        });
        
        res.status(201).json({ message: 'Live stream created successfully', liveStream });
    } catch (error) {
        console.error('Error creating live stream:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update live stream (superadmin only)
router.put('/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    try {
        const stream = db.getLiveStreamById(req.params.id);
        if (!stream) {
            return res.status(404).json({ error: 'Live stream not found' });
        }
        
        const updatedStream = db.updateLiveStream(req.params.id, req.body);
        res.json({ message: 'Live stream updated successfully', liveStream: updatedStream });
    } catch (error) {
        console.error('Error updating live stream:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete live stream (superadmin only)
router.delete('/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    try {
        const success = db.deleteLiveStream(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Live stream not found' });
        }
        res.json({ message: 'Live stream deleted successfully' });
    } catch (error) {
        console.error('Error deleting live stream:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
