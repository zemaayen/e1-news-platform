# 🗞️ E1 News Platform

A modern, full-featured news website built with Node.js, Express, and vanilla JavaScript.

**Features:** Responsive design, admin panel, live streaming, comments, ad management, HTTPS security, and cloud-ready deployment.

## Features

### Content Management
- **Article Management**: Create, edit, and delete articles with rich media support
- **Multi-Category Support**: Political, World, Technology, Sports, Business, Entertainment, Health
- **Media Support**: Images and videos for articles
- **Custom Styling**: Per-article background and title color customization for hero section

### User Features
- **Authentication System**: User login and registration with JWT tokens
- **Role-Based Access**: Super admin, reporter, and regular user roles
- **Public Engagement**: Anonymous comments and reactions (likes/dislikes)
- **Real-Time Chat**: Reporter chat functionality with media sharing

### Admin Features
- **Super Admin Dashboard**: Complete control over site settings and content
- **Site Customization**: Change site name, tagline, and primary color
- **Ad Management**: Manage advertisements across multiple placements
- **User Management**: View and manage registered users

### Technical Features
- **Responsive Design**: Optimized for all screen sizes
- **HTTPS Security**: Automatic SSL encryption in production
- **Security Headers**: XSS protection, HSTS, frame protection
- **File Uploads**: Secure file handling with Multer
- **Data Persistence**: JSON-based file storage (upgradable to MongoDB)
- **Search Functionality**: Search articles by title and content
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Cloud Ready**: Configured for Render deployment with free tier

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup

1. **Clone or extract the project**
   ```bash
   cd news-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Main site: `http://localhost:3000`
   - Super Admin: `http://localhost:3000/superadmin.html`
   - Login: `http://localhost:3000/login`

## 🚀 Cloud Deployment

**Deploy to Render (FREE):**
1. Push code to GitHub
2. Connect repository on Render.com
3. Deploy with automatic HTTPS!

See `../DEPLOY-TO-CLOUD.md` for detailed instructions.

## Default Credentials

### Super Admin
- **Email**: `admin@news.com`
- **Password**: `admin123`

### Reporter
- **Email**: `reporter@news.com`
- **Password**: `reporter123`

## Project Structure

```
news-platform/
├── public/                 # Client-side files
│   ├── index.html         # Homepage
│   ├── article.html       # Article page
│   ├── login.html         # Login page
│   ├── superadmin.html    # Admin dashboard
│   ├── superadmin.js      # Admin functionality
│   ├── styles.css         # Main stylesheet
│   └── translations.js    # Language translations
├── data/                  # Persistent data storage
│   ├── users.json         # User accounts
│   ├── articles.json      # Articles
│   ├── comments.json      # Comments
│   ├── reactions.json     # Likes/dislikes
│   ├── chatMessages.json  # Chat history
│   ├── settings.json      # Site settings
│   └── ads.json           # Advertisements
├── uploads/               # Uploaded media files
├── docs/                  # Documentation
├── server.js              # Express server
├── database.js            # Database operations
└── package.json           # Dependencies

## Documentation

Detailed documentation is available in the `/docs` directory:

- **Guides**: Step-by-step how-to guides
- **Features**: Feature-specific documentation
- **API**: API endpoints and usage

## Features in Detail

### Article Management
- Rich text content
- Media attachments (images/videos)
- Category assignment
- Author attribution
- View counter
- Custom hero section styling

### User Engagement
- **Comments**: Public commenting system with username
- **Reactions**: Like/dislike functionality
- **Chat**: Real-time reporter chat with media support

### Admin Dashboard
- Article creation and management
- User management
- Site settings customization
- Advertisement management
- Analytics (view counts)

### Responsive Design
- Mobile-optimized interface
- Tablet-friendly layout
- Desktop full features
- Touch-friendly controls

## 🔒 Security Features

- **HTTPS Enforcement**: Automatic redirect in production
- **Password Hashing**: bcryptjs with salt
- **JWT Authentication**: Secure token-based auth
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options
- **File Validation**: Type and size checks
- **XSS Protection**: Enabled by default
- **CORS**: Configured for cross-origin requests

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Running in Development
```bash
npm run dev
```
This will start the server with nodemon for auto-restart on file changes.

### Port Configuration
Default port is 3000. You can change it in `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

## Troubleshooting

### Port Already in Use
If port 3000 is in use, either:
1. Stop the process using port 3000
2. Change the port in `server.js`

### File Upload Issues
- Check `uploads/` directory exists and has write permissions
- Verify file size limits in `server.js` (default: 50MB)

### Database Issues
- Ensure `data/` directory exists
- Check file permissions for JSON files
- If corrupted, delete JSON files to reset (will lose data)

## License

This project is for educational and demonstration purposes.

## Support

For issues or questions, please check the documentation in the `/docs` directory.

## 🎯 Production vs Development

### Local Development
- HTTP (localhost:3000)
- File-based storage
- Debug logging enabled

### Production (Cloud)
- HTTPS with SSL certificate
- Environment variables for secrets
- Security headers enforced
- Production optimizations

## 📦 Environment Variables

Create `.env` file for production (see `.env.example`):
```env
PORT=3000
JWT_SECRET=your-secret-key
NODE_ENV=production
```

## 🔄 Version

**Current Version:** 1.0.0  
**Last Updated:** November 2025  
**Status:** Production Ready ✅
