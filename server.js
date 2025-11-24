const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Force HTTPS in production
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
});

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
});

// Private Mode - Password protect entire site during development
const SITE_PASSWORD = process.env.SITE_PASSWORD; // Set this in Render dashboard
app.use((req, res, next) => {
    // Skip if no password is set (site is public)
    if (!SITE_PASSWORD) {
        return next();
    }
    
    // Skip password check for access page itself
    if (req.path === '/site-access') {
        return next();
    }
    
    // Check if user has valid access cookie
    if (req.cookies.siteAccess === SITE_PASSWORD) {
        return next();
    }
    
    // Show access page
    return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Private Site - Access Required</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .access-box {
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    max-width: 400px;
                    width: 100%;
                }
                .lock-icon {
                    width: 60px;
                    height: 60px;
                    background: #667eea;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    font-size: 30px;
                }
                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 10px;
                    font-size: 24px;
                }
                p {
                    text-align: center;
                    color: #666;
                    margin-bottom: 30px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                label {
                    display: block;
                    margin-bottom: 8px;
                    color: #555;
                    font-weight: 500;
                }
                input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: border-color 0.3s;
                }
                input:focus {
                    outline: none;
                    border-color: #667eea;
                }
                button {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                button:hover {
                    transform: translateY(-2px);
                }
                .error {
                    background: #fee;
                    color: #c33;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    text-align: center;
                    display: none;
                }
                .error.show { display: block; }
            </style>
        </head>
        <body>
            <div class="access-box">
                <div class="lock-icon">🔒</div>
                <h1>Private Site</h1>
                <p>This site is currently in development mode.<br>Please enter the access password.</p>
                
                <div class="error" id="error">Invalid password. Please try again.</div>
                
                <form id="accessForm">
                    <div class="form-group">
                        <label for="password">Access Password</label>
                        <input type="password" id="password" name="password" required autofocus>
                    </div>
                    <button type="submit">Enter Site</button>
                </form>
            </div>
            
            <script>
                document.getElementById('accessForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const password = document.getElementById('password').value;
                    const error = document.getElementById('error');
                    
                    try {
                        const response = await fetch('/site-access', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ password })
                        });
                        
                        if (response.ok) {
                            window.location.reload();
                        } else {
                            error.classList.add('show');
                            document.getElementById('password').value = '';
                        }
                    } catch (err) {
                        error.classList.add('show');
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// Handle password submission
app.post('/site-access', (req, res) => {
    const { password } = req.body;
    
    if (password === SITE_PASSWORD) {
        res.cookie('siteAccess', password, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        return res.json({ success: true });
    }
    
    return res.status(401).json({ error: 'Invalid password' });
});

app.use(express.static('public'));
app.use('/uploads', express.static(uploadsDir)); // Serve uploaded files

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

// Role-based access control
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user exists
        const existingUser = db.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = db.createUser({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = db.getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, role: user.role, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
    const user = db.getUserById(req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// ==================== USER MANAGEMENT (Super Admin Only) ====================

app.get('/api/users', authenticateToken, authorize('superadmin'), (req, res) => {
    const users = db.getAllUsers();
    res.json({ users });
});

app.post('/api/users', authenticateToken, authorize('superadmin'), async (req, res) => {
    try {
        const { username, email, password, role, fullName, profilePicture } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = db.createUser({ 
            username, 
            email, 
            password: hashedPassword, 
            role,
            fullName: fullName || username,
            profilePicture: profilePicture || null
        });
        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/users/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    const user = db.updateUser(parseInt(req.params.id), req.body);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated', user });
});

app.delete('/api/users/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    const success = db.deleteUser(parseInt(req.params.id));
    if (!success) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
});

// ==================== FILE UPLOAD ROUTES ====================

// Upload single file (image, video, or audio)
app.post('/api/upload', authenticateToken, authorize('reporter', 'superadmin'), upload.single('file'), (req, res) => {
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
app.post('/api/upload-multiple', authenticateToken, authorize('reporter', 'superadmin'), 
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

// ==================== ARTICLE ROUTES ====================

// Get all articles (public)
app.get('/api/articles', (req, res) => {
    const { category, status } = req.query;
    const filters = {};
    
    if (category) filters.category = category;
    // Only show published articles to public
    filters.status = status || 'published';
    
    const articles = db.getAllArticles(filters);
    res.json({ articles });
});

// Get my articles (reporter)
app.get('/api/articles/my', authenticateToken, authorize('reporter', 'superadmin'), (req, res) => {
    const articles = db.getAllArticles({ authorId: req.user.id });
    res.json({ articles });
});

// Get single article
app.get('/api/articles/:id', (req, res) => {
    const article = db.getArticleById(req.params.id);
    if (!article) {
        return res.status(404).json({ error: 'Article not found' });
    }
    // Increment views
    db.incrementArticleViews(req.params.id);
    res.json({ article });
});

// Create article (reporter, superadmin)
app.post('/api/articles', authenticateToken, authorize('reporter', 'superadmin'), (req, res) => {
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
app.put('/api/articles/:id', authenticateToken, authorize('reporter', 'superadmin'), (req, res) => {
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
app.delete('/api/articles/:id', authenticateToken, authorize('reporter', 'superadmin'), (req, res) => {
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

// ==================== COMMENT ROUTES ====================

// Get comments for article
app.get('/api/articles/:id/comments', (req, res) => {
    const comments = db.getCommentsByArticleId(req.params.id);
    res.json({ comments });
});

// Post comment (public - no auth required)
app.post('/api/articles/:id/comments', (req, res) => {
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
app.delete('/api/comments/:id', authenticateToken, (req, res) => {
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

// ==================== REACTION ROUTES (Like/Dislike) ====================

// Get reactions for an article
app.get('/api/articles/:id/reactions', (req, res) => {
    const counts = db.getReactionCounts(req.params.id);
    res.json({ reactions: counts });
});

// Get user's reaction for an article (public - uses sessionId)
app.get('/api/articles/:id/reactions/me', (req, res) => {
    const sessionId = req.query.sessionId;
    
    if (!sessionId) {
        return res.json({ reaction: null });
    }
    
    const userReaction = db.getUserReaction(req.params.id, sessionId);
    res.json({ reaction: userReaction ? userReaction.type : null });
});

// Add or update reaction (public - no auth required)
app.post('/api/articles/:id/reactions', (req, res) => {
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

// ==================== SETTINGS ROUTES (Super Admin Only) ====================

app.get('/api/settings', (req, res) => {
    const settings = db.getSettings();
    res.json({ settings });
});

app.put('/api/settings', authenticateToken, authorize('superadmin'), (req, res) => {
    const settings = db.updateSettings(req.body);
    res.json({ message: 'Settings updated', settings });
});

// ==================== STATS ROUTES ====================

app.get('/api/stats', authenticateToken, authorize('superadmin', 'reporter'), (req, res) => {
    const stats = db.getStats();
    res.json({ stats });
});

// ==================== SERVE FRONTEND ====================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/superadmin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'superadmin.html'));
});

app.get('/reporter', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reporter.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

app.get('/article/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'article.html'));
});

// ==================== CHAT MESSAGES (TRENDING NOW) ====================

// Get all chat messages (public)
app.get('/api/chat-messages', (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const messages = db.getRecentChatMessages(limit);
    res.json({ messages });
});

// Create chat message (reporters and superadmin only)
app.post('/api/chat-messages', authenticateToken, authorize('reporter', 'superadmin'), (req, res) => {
    try {
        const { message, mediaType, mediaUrl } = req.body;
        
        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }
        
        // Get user details
        const user = db.getUserById(req.user.id);
        const userFullName = user.fullName || (user.email ? user.email.split('@')[0] : req.user.username);
        
        const chatMessage = db.createChatMessage({
            userId: req.user.id,
            username: req.user.username,
            userRole: req.user.role,
            userFullName: userFullName,
            profilePicture: user.profilePicture || null,
            message: message.trim(),
            mediaType: mediaType || null,
            mediaUrl: mediaUrl || null
        });
        
        res.status(201).json({ message: 'Chat message created', chatMessage });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete chat message (superadmin only)
app.delete('/api/chat-messages/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    const success = db.deleteChatMessage(parseInt(req.params.id));
    if (!success) {
        return res.status(404).json({ error: 'Chat message not found' });
    }
    res.json({ message: 'Chat message deleted' });
});

// ===== TAGS ROUTES =====

// Get all tags
app.get('/api/tags', (req, res) => {
    try {
        const tags = db.getAllTags();
        res.json({ tags });
    } catch (error) {
        console.error('Error getting tags:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get popular tags
app.get('/api/tags/popular', (req, res) => {
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
app.get('/api/tags/:tag/articles', (req, res) => {
    try {
        const articles = db.getArticlesByTag(req.params.tag);
        res.json({ articles });
    } catch (error) {
        console.error('Error getting articles by tag:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ===== AD MANAGEMENT ROUTES =====

// Get all ads (superadmin only)
app.get('/api/ads', authenticateToken, authorize('superadmin'), (req, res) => {
    const ads = db.getAllAds(req.query);
    res.json({ ads });
});

// Get active ad by space (public)
app.get('/api/ads/active/:adSpace', (req, res) => {
    const ad = db.getActiveAdBySpace(req.params.adSpace);
    if (ad) {
        // Increment view count
        db.incrementAdViews(ad.id);
    }
    res.json({ ad });
});

// Get single ad by ID (superadmin only)
app.get('/api/ads/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    const ad = db.getAdById(req.params.id);
    if (!ad) {
        return res.status(404).json({ error: 'Ad not found' });
    }
    res.json({ ad });
});

// Create new ad (superadmin only)
app.post('/api/ads', authenticateToken, authorize('superadmin'), (req, res) => {
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
app.put('/api/ads/:id', authenticateToken, authorize('superadmin'), (req, res) => {
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
app.delete('/api/ads/:id', authenticateToken, authorize('superadmin'), (req, res) => {
    const success = db.deleteAd(req.params.id);
    if (!success) {
        return res.status(404).json({ error: 'Ad not found' });
    }
    res.json({ message: 'Ad deleted successfully' });
});

// Track ad click (public)
app.post('/api/ads/:id/click', (req, res) => {
    const success = db.incrementAdClicks(req.params.id);
    if (!success) {
        return res.status(404).json({ error: 'Ad not found' });
    }
    res.json({ message: 'Click tracked' });
});

// ===== LIVE STREAMING ROUTES =====

// Get all live streams
app.get('/api/livestreams', (req, res) => {
    try {
        const streams = db.getAllLiveStreams(req.query);
        res.json({ liveStreams: streams });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single live stream by ID
app.get('/api/livestreams/:id', (req, res) => {
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
app.post('/api/livestreams', authenticateToken, authorize('superadmin'), (req, res) => {
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
app.put('/api/livestreams/:id', authenticateToken, authorize('superadmin'), (req, res) => {
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
app.delete('/api/livestreams/:id', authenticateToken, authorize('superadmin'), (req, res) => {
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

// ==================== NEWSLETTER API ====================

// Subscribe to newsletter (public)
app.post('/api/newsletter/subscribe', async (req, res) => {
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
app.post('/api/newsletter/unsubscribe', async (req, res) => {
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
app.get('/api/newsletter/subscribers', authenticateToken, authorize('superadmin'), async (req, res) => {
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

// ==================== PUSH NOTIFICATIONS API ====================

// Store push subscriptions
app.post('/api/push/subscribe', async (req, res) => {
    try {
        const subscription = req.body;
        
        // Store subscription in database (you can enhance this)
        // For now, just acknowledge receipt
        console.log('Push subscription received:', subscription);
        
        res.status(201).json({ message: 'Subscription saved successfully' });
    } catch (error) {
        console.error('Error saving push subscription:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Send push notification (superadmin only)
app.post('/api/push/send', authenticateToken, authorize('superadmin'), async (req, res) => {
    try {
        const { title, body, url, icon } = req.body;
        
        // In a real application, you would:
        // 1. Get all subscriptions from database
        // 2. Use web-push library to send notifications
        // 3. Handle failed subscriptions
        
        // For now, return success
        res.json({ message: 'Notifications sent successfully' });
    } catch (error) {
        console.error('Error sending push notification:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get local IP address
const os = require('os');
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    // Prioritize WiFi adapters
    const wifiNames = ['Wi-Fi', 'WiFi', 'WLAN', 'Wireless'];
    
    for (const wifiName of wifiNames) {
        if (interfaces[wifiName]) {
            for (const iface of interfaces[wifiName]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
    }
    
    // Fallback to any non-internal IPv4
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '0.0.0.0';
}

// Start server - explicitly bind to 0.0.0.0 to accept all connections
app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║       🗞️  E1 News Platform Server Running! 🗞️         ║
║                                                        ║
║   Server: http://localhost:${PORT}                       ║
║   Network: http://${localIP}:${PORT}                    ║
║                                                        ║
║   📱 Public Site: http://localhost:${PORT}/              ║
║   📱 From Phone: http://${localIP}:${PORT}/             ║
║   🔐 Login: http://localhost:${PORT}/login               ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;

