const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-randomstring-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
    }
});

// File filter for security
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedMimes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/ogg',
        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, videos, and audio files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB max file size
    }
});

// Upload single file (image, video, or audio)
router.post('/', authenticateToken, authorize('reporter', 'superadmin'), upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Return the file URL
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({
            success: true,
            url: fileUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'File upload failed: ' + error.message });
    }
});

// Upload multiple files at once (thumbnail + media)
router.post('/multiple', authenticateToken, authorize('reporter', 'superadmin'), 
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'media', maxCount: 1 }
    ]), 
    (req, res) => {
        try {
            if (!req.files || (!req.files.thumbnail && !req.files.media)) {
                return res.status(400).json({ error: 'No files uploaded' });
            }
            
            const response = {};
            
            if (req.files.thumbnail && req.files.thumbnail[0]) {
                response.thumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;
            }
            
            if (req.files.media && req.files.media[0]) {
                response.mediaUrl = `/uploads/${req.files.media[0].filename}`;
            }
            
            res.json({
                success: true,
                ...response
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'File upload failed: ' + error.message });
        }
    }
);

// Export uploadsDir for use in server.js
module.exports = router;
module.exports.uploadsDir = uploadsDir;
