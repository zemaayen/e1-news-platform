# MongoDB & Cloudinary Setup Guide

This guide will help you migrate your news platform from file-based storage to MongoDB and Cloudinary.

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Cloudinary account (free tier available)

---

## 🗄️ Step 1: MongoDB Setup

### Option A: Local MongoDB

1. **Install MongoDB:**
   - **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - **Mac**: `brew install mongodb-community`
   - **Linux**: `sudo apt-get install mongodb`

2. **Start MongoDB:**
   ```bash
   # Windows (as service)
   net start MongoDB
   
   # Mac/Linux
   brew services start mongodb-community
   # or
   mongod
   ```

3. **Verify Installation:**
   ```bash
   mongosh
   # You should see MongoDB shell
   ```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. **Create Account:**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Setup Database Access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Read and write to any database"

4. **Setup Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`

---

## ☁️ Step 2: Cloudinary Setup

1. **Create Account:**
   - Go to [cloudinary.com](https://cloudinary.com/users/register/free)
   - Sign up for free (25GB storage, 25GB bandwidth/month)

2. **Get Credentials:**
   - Go to Dashboard
   - You'll see:
     - Cloud Name
     - API Key
     - API Secret
   - Copy these values

3. **Configure Upload Presets (Optional):**
   - Go to Settings → Upload
   - Create presets for different media types
   - Set transformations and folder structures

---

## ⚙️ Step 3: Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cp config.env.example .env
   ```

2. **Edit `.env` file:**
   ```env
   # MongoDB Configuration
   # For Local:
   MONGODB_URI=mongodb://localhost:27017/news-platform
   
   # For MongoDB Atlas:
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/news-platform?retryWrites=true&w=majority
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   
   # JWT Secret (generate a random string)
   JWT_SECRET=your_super_secret_jwt_key_change_this
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

3. **Replace values:**
   - MongoDB Atlas: Replace username, password, and cluster URL
   - Cloudinary: Replace with your actual credentials
   - JWT_SECRET: Use a long random string (or generate one online)

---

## 📦 Step 4: Install Dependencies

```bash
cd news-platform
npm install
```

This will install:
- `mongoose` - MongoDB ODM
- `cloudinary` - Cloudinary SDK
- `multer-storage-cloudinary` - File upload integration
- `dotenv` - Environment variables
- And all existing dependencies

---

## 🚀 Step 5: Start the Application

1. **Development mode (with auto-reload):**
   ```bash
   npm run dev
   ```

2. **Production mode:**
   ```bash
   npm start
   ```

3. **Check console output:**
   ```
   ✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
   📊 Database: news-platform
   🚀 Server running on port 3000
   ```

---

## 📊 Step 6: Initialize Database (First Time Only)

The application will automatically create the database and collections on first run.

**Default Admin Account:**
- Username: `superadmin`
- Password: `admin123`
- Role: superadmin

**Default Reporter Account:**
- Username: `reporter`
- Password: `reporter123`
- Role: reporter

**⚠️ IMPORTANT: Change these passwords immediately in production!**

---

## 🔄 Migrating Existing Data (Optional)

If you have existing data in JSON files (from the old system):

1. **Keep your old `data/` folder temporarily**

2. **Create a migration script** (optional - contact for assistance)

3. **Manual migration:**
   - Log in as superadmin
   - Recreate articles, users, and content through the UI
   - Old data in `data/` folder will not be used automatically

---

## 📁 File Upload Changes

### Before (File-based):
```javascript
// Files saved to: news-platform/public/uploads/
```

### After (Cloudinary):
```javascript
// Files saved to: Cloudinary cloud storage
// Organized in folders:
// - news-platform/images/    (articles, thumbnails)
// - news-platform/profiles/  (profile pictures)
// - news-platform/videos/    (video content)
// - news-platform/audio/     (audio content)
```

### Benefits:
✅ Unlimited storage (within plan limits)
✅ Automatic image optimization
✅ CDN delivery (faster loading)
✅ Image transformations on-the-fly
✅ Video streaming support
✅ Backup and redundancy

---

## 🛠️ Troubleshooting

### MongoDB Connection Issues

**Error: "MongooseServerSelectionError"**
- Check if MongoDB is running (local) or connection string is correct (Atlas)
- Verify network access in MongoDB Atlas
- Check if IP is whitelisted

**Error: "Authentication failed"**
- Verify username and password in connection string
- URL encode special characters in password
- Check database user permissions

### Cloudinary Issues

**Error: "Invalid cloud_name"**
- Verify CLOUDINARY_CLOUD_NAME in .env
- No spaces or quotes around values

**Error: "Upload failed"**
- Check file size limits
- Verify API credentials
- Check Cloudinary dashboard for quota limits

### General Issues

**Error: "Cannot find module"**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

**Error: "Port 3000 already in use"**
- Change PORT in .env file
- Or stop the process using port 3000

---

## 📚 MongoDB Commands (Useful)

### View all databases:
```bash
mongosh
show dbs
```

### Use your database:
```bash
use news-platform
```

### View collections:
```bash
show collections
```

### Query data:
```bash
db.users.find().pretty()
db.articles.find({ status: 'published' }).pretty()
db.articles.countDocuments()
```

### Delete all data (careful!):
```bash
db.articles.deleteMany({})
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file to Git**
   - Already in `.gitignore`

2. **Use strong passwords**
   - MongoDB users
   - Admin accounts

3. **Change default credentials**
   - Update superadmin and reporter passwords

4. **Restrict MongoDB network access**
   - Use specific IP addresses in production
   - Don't use "Allow from anywhere" in production

5. **Keep API secrets secure**
   - Cloudinary API secret
   - JWT secret

---

## 📞 Support

If you encounter any issues:

1. Check this guide carefully
2. Review error messages in console
3. Check MongoDB Atlas dashboard
4. Check Cloudinary dashboard
5. Verify all environment variables

---

## 🎉 Success!

Once everything is running:
- Open: `http://localhost:3000`
- Login as superadmin
- Start creating content!
- All files will automatically upload to Cloudinary
- All data will automatically save to MongoDB

**Enjoy your production-ready news platform!** 🚀

