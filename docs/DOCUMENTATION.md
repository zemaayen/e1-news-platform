# 📰 NewsHub Platform - Complete Documentation

**Version:** 2.0  
**Last Updated:** November 18, 2025

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Features](#features)
3. [User Roles](#user-roles)
4. [Advertisement System](#advertisement-system)
5. [Multi-Language Support](#multi-language-support)
6. [File Uploads](#file-uploads)
7. [Chat/Live Updates](#chatlive-updates)
8. [Social Media Integration](#social-media-integration)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

**Windows Users:**
```bash
# Double-click start.bat
# OR run manually:
cd news-platform
npm install
npm start
```

**Mac/Linux Users:**
```bash
cd news-platform
npm install
npm start
```

### Access the Platform
- **Website:** http://localhost:3000
- **Login Page:** http://localhost:3000/login.html

### Default Accounts
- **Super Admin:** `superadmin` / `admin123`
- **Reporter:** `reporter` / `reporter123`
- **User:** `user` / `user123`

---

## ✨ Features

### Core Features
- ✅ Multi-role user system (4 roles)
- ✅ Article management (create, edit, delete, publish)
- ✅ Comment system
- ✅ Live chat/trending updates
- ✅ Advertisement management system
- ✅ Multi-language support (English, Amharic, Hebrew)
- ✅ File uploads (images, videos, audio)
- ✅ Responsive design
- ✅ Social media integration
- ✅ Video autoplay on scroll/hover
- ✅ Full-screen video player
- ✅ Breaking news ticker

---

## 👥 User Roles

### 1. Super Admin (Full Control)
**Access:** `superadmin` / `admin123`

**Capabilities:**
- ✅ Manage all users
- ✅ Create/edit/delete articles
- ✅ Manage advertisements
- ✅ Post live chat updates
- ✅ View all statistics
- ✅ Configure site settings
- ✅ Access all dashboards

### 2. Reporter (Content Creator)
**Access:** `reporter` / `reporter123`

**Capabilities:**
- ✅ Create/edit own articles
- ✅ Upload media files
- ✅ Post live chat updates
- ✅ View own article statistics

### 3. Simple User (Registered User)
**Access:** `user` / `user123`

**Capabilities:**
- ✅ View all articles
- ✅ Post comments
- ✅ View profile
- ✅ Manage own comments

### 4. End User (Public Visitor)
**No login required**

**Capabilities:**
- ✅ Browse articles
- ✅ View live updates
- ✅ Search content
- ✅ Share on social media

---

## 📢 Advertisement System

### Overview
Full-featured ad management system with 8 ad spaces across the website.

### Ad Spaces

#### Homepage:
1. **top-banner** - Top Banner (970x90) - After breaking news
2. **bottom-banner** - Bottom Banner (728x90) - Before footer
3. **sidebar-ad-1** - Sidebar #1 (300x250) - Right sidebar
4. **sidebar-ad-2** - Sidebar #2 (300x600) - Right sidebar
5. **popup-ad** - Popup (750x500) - Full-screen overlay

#### Article Pages:
6. **article-top** - Top Banner (970x90) - After navigation
7. **article-bottom** - Bottom Banner (728x90) - After comments
8. **article-popup** - Popup (750x500) - Full-screen overlay

### Supported Ad Types
- 🖼️ **Image** - JPG, PNG, GIF
- 🎥 **Video** - MP4, WebM
- 🔊 **Audio** - MP3, OGG
- 📄 **HTML** - Custom HTML/CSS/JavaScript

### Creating an Ad

1. Login as Super Admin
2. Go to Dashboard → **📢 Manage Ads**
3. Click **+ Create New Ad**
4. Fill in details:
   - **Ad Name:** Internal reference name
   - **Ad Spaces:** Check all locations where ad should appear
   - **Media Type:** Choose type
   - **Upload/URL:** Provide content
   - **Link URL:** (Optional) Click destination
   - **Schedule:** Set start/end dates
   - **Active:** Check to enable
5. Click **Save Ad**

### Multi-Space Ads
✅ **One ad can appear in multiple locations!**

Simply check all the ad spaces where you want the same ad to show. This is perfect for:
- Site-wide campaigns
- Consistent branding
- Easy management

### Ad Statistics
Track performance:
- 👁️ **Views** - How many times ad was shown
- 🖱️ **Clicks** - How many times ad was clicked
- 📊 **CTR** - Click-through rate percentage

---

## 🌍 Multi-Language Support

### Supported Languages
- 🇬🇧 **English** (EN)
- 🇪🇹 **Amharic** (አማ)
- 🇮🇱 **Hebrew** (עב)

### Features
- ✅ Complete UI translation
- ✅ Dynamic content translation
- ✅ RTL support for Hebrew
- ✅ Date/time localization
- ✅ Persistent language selection

### Switching Languages
Click the language buttons in the top-right corner:
- **EN** - English
- **አማ** - Amharic
- **עב** - Hebrew

The entire website updates instantly, including:
- Navigation menus
- Article categories
- Buttons and labels
- Date/time format
- Layout direction (RTL for Hebrew)

---

## 📁 File Uploads

### Supported File Types

#### Images:
- JPG/JPEG
- PNG
- GIF
- WebP
- Max size: 10MB

#### Videos:
- MP4
- WebM
- MOV
- Max size: 50MB

#### Audio:
- MP3
- OGG
- WAV
- Max size: 20MB

### Uploading Files

**In Article Editor:**
1. Select "Upload File" option
2. Click "Choose File"
3. Select your file
4. Preview appears
5. Save article

**In Chat/Live Updates:**
1. Click "Upload File" radio button
2. Choose image or video
3. Preview shows
4. Post update

**For Ads:**
1. In ad creation form
2. Select media type
3. Choose "Upload File"
4. Select file
5. Preview appears
6. Save ad

### File Storage
All uploaded files are stored in `/uploads` directory with unique names to prevent conflicts.

---

## 💬 Chat/Live Updates

### Overview
Real-time chat system for reporters to post quick updates that users can see.

### Features
- ✅ Reporter/admin can post updates
- ✅ Support for text, images, videos
- ✅ Shows reporter profile picture and name
- ✅ Character limit (500 chars)
- ✅ Full-screen chat modal
- ✅ Auto-refresh
- ✅ WhatsApp-style design

### Posting Live Updates

**As Reporter or Super Admin:**
1. Go to your dashboard
2. Find "🔥 Post Live Update" section
3. Type your message (max 500 characters)
4. Optionally attach media (image/video)
5. Click **📤 Post Update**

### Viewing Chat
**As Any User:**
- See latest updates in sidebar widget on homepage
- Click widget to open full-screen chat
- Scroll through all messages
- Click × to close

---

## 📱 Social Media Integration

### Supported Platforms
- WhatsApp (Share)
- TikTok
- Instagram
- YouTube
- Twitter/X

### Features
- ✅ One-click sharing to WhatsApp
- ✅ Direct links to your social profiles
- ✅ SVG icons with hover effects
- ✅ Visible in top bar
- ✅ Mobile-friendly

### Setup

**Edit Social Media Links:**
Open `index.html` and `article.html`, find:

```html
<a href="https://www.tiktok.com/@yourchannel">TikTok</a>
<a href="https://www.instagram.com/yourprofile">Instagram</a>
<a href="https://www.youtube.com/@yourchannel">YouTube</a>
<a href="https://twitter.com/yourhandle">Twitter</a>
```

Replace with your actual social media URLs.

**WhatsApp Sharing:**
Automatically shares current page title and URL. No setup needed!

---

## 🎨 Customization

### Changing Site Name

1. Open `server.js`
2. Find `siteName: 'NewsHub'`
3. Change to your name
4. Restart server

### Changing Colors

Open `styles.css` and modify CSS variables:
```css
:root {
    --n12-red: #d32028;  /* Main theme color */
    --n12-red-dark: #9e1018;  /* Dark variant */
}
```

### Adding Logo

1. Create a `logo.png` file
2. Place in `/news-platform/public/` directory
3. Recommended size: 200x50 pixels
4. Refresh page

---

## 🐛 Troubleshooting

### Website Not Loading
**Problem:** "This site can't be reached"  
**Solution:**
1. Make sure server is running (`npm start`)
2. Check port 3000 is not in use
3. Try: `http://localhost:3000`

### Can't Login
**Problem:** "Invalid credentials"  
**Solution:**
1. Use correct credentials (see Quick Start)
2. Clear browser cache
3. Try incognito/private window

### Ads Not Showing
**Problem:** Created ad but not visible  
**Solution:**
1. Check ad is **Active** ✅
2. Check start date is today or earlier
3. Check correct ad space selected
4. Hard refresh: `Ctrl + Shift + R`
5. Clear browser cache

### Files Not Uploading
**Problem:** Upload fails or shows error  
**Solution:**
1. Check file size limits
2. Check file type is supported
3. Ensure `/uploads` folder exists
4. Check server is running

### Edit Button Not Working
**Problem:** Can't edit articles/ads/users  
**Solution:**
1. Hard refresh: `Ctrl + Shift + R`
2. Clear browser cache
3. Check you're logged in
4. Check you have correct role permissions

### Language Not Switching
**Problem:** Language buttons don't work  
**Solution:**
1. Check `translations.js` is loaded
2. Clear browser cache
3. Hard refresh page

---

## 🔒 Security Notes

### Important:
- ⚠️ This is a **DEMO** system using in-memory database
- ⚠️ Data is **NOT persistent** (resets on server restart)
- ⚠️ **DO NOT use in production** without proper database
- ⚠️ Default passwords should be changed

### For Production Use:
1. Replace in-memory database with MongoDB/PostgreSQL
2. Add proper password encryption
3. Implement session management
4. Add HTTPS/SSL
5. Configure proper CORS
6. Add rate limiting
7. Implement file upload validation
8. Add backup system

---

## 📞 Support

### Common Issues
See [Troubleshooting](#troubleshooting) section above.

### File Locations
- **Server:** `server.js`
- **Database:** `database.js`
- **Frontend:** `public/` directory
- **Styles:** `public/styles.css`
- **Translations:** `public/translations.js`
- **Uploads:** `uploads/` directory

---

## 🎯 Quick Reference

### Ports
- **Website:** http://localhost:3000
- **API:** http://localhost:3000/api/*

### Key Directories
```
news-platform/
├── public/           # Frontend files
│   ├── index.html   # Homepage
│   ├── article.html # Article page
│   ├── login.html   # Login page
│   ├── *.html       # Dashboard pages
│   ├── styles.css   # Main stylesheet
│   └── *.js         # JavaScript files
├── uploads/         # Uploaded files
├── server.js        # Backend server
├── database.js      # Data storage
└── package.json     # Dependencies
```

### Important Commands
```bash
npm install    # Install dependencies
npm start      # Start server
Ctrl+C         # Stop server
```

### Keyboard Shortcuts
- `Ctrl + Shift + R` - Hard refresh (clears cache)
- `F12` - Open browser dev tools
- `ESC` - Close popup ads
- `Ctrl + F` - Search on page

---

## 📄 License

This is a demo project for educational purposes.

---

**Built with ❤️ using Node.js + Express + Vanilla JavaScript**

