const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001; // Run on 3001 to avoid conflict with V1

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Load data (simulated database for now, pointing to V1 data if needed or new V2 data)
// For now, we'll just serve static files and maybe mock API

// API Routes
app.get('/api/status', (req, res) => {
    res.json({ status: 'active', version: '2.0.0', message: 'News Platform V2 is running!' });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
    🚀 News Platform V2 is running!
    URL: http://localhost:${PORT}
    `);
});
