const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const os = require('os');
const db = require('./database');

// Import middleware
const { privateModeMiddleware, handleSiteAccess } = require('./middleware/privateMode');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/comments');
const reactionRoutes = require('./routes/reactions');
const settingsRoutes = require('./routes/settings');
const statsRoutes = require('./routes/stats');
const chatRoutes = require('./routes/chat');
const tagRoutes = require('./routes/tags');
const adRoutes = require('./routes/ads');
const livestreamRoutes = require('./routes/livestreams');
const newsletterRoutes = require('./routes/newsletter');
const pushRoutes = require('./routes/push');
const uploadRoutes = require('./routes/upload');
const { uploadsDir } = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Private mode middleware
app.use(privateModeMiddleware);
app.post('/site-access', handleSiteAccess);

// Static files
app.use(express.static('public'));
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api', commentRoutes);  // Handles /api/articles/:id/comments and /api/comments/:id
app.use('/api', reactionRoutes); // Handles /api/articles/:id/reactions
app.use('/api/settings', settingsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/chat-messages', chatRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/livestreams', livestreamRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/upload', uploadRoutes);

// Legacy upload route for backwards compatibility
app.use('/api/upload-multiple', (req, res, next) => {
    req.url = '/multiple';
    uploadRoutes(req, res, next);
});

// Frontend routes
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

// Get local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
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
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '0.0.0.0';
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║       E1 News Platform Server Running!                 ║
║                                                        ║
║   Server: http://localhost:${PORT}                       ║
║   Network: http://${localIP}:${PORT}                    ║
║                                                        ║
║   Public Site: http://localhost:${PORT}/                 ║
║   Login: http://localhost:${PORT}/login                  ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
