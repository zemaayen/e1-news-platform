# 📤 How to Upload Files from Your PC

## ✅ Feature is ALREADY Implemented!

Your news platform **already supports uploading files** from your PC. No need for external URLs!

---

## 🎯 Quick Start Guide

### 1. **Login as Reporter or Super Admin**
- Go to: `http://localhost:3000/login`
- Use credentials:
  - **Reporter**: `reporter` / `reporter123`
  - **Super Admin**: `superadmin` / `admin123`

---

### 2. **Create a New Article**

#### **Reporter Dashboard:**
1. Click **"+ Create New Article"**
2. Fill in Title, Category, Content

#### **For Thumbnail Image:**
You'll see two options:
```
○ Use URL          ● Upload File
```

- Select **"Upload File"**
- Click **"Choose File"**
- Select an image from your PC (JPG, PNG, GIF, WebP)
- Max size: 100MB
- You'll see a preview of your image!

---

#### **For Media (Video/Audio):**

1. **Select Media Type:**
   - `📷 Image Only` (uses thumbnail above)
   - `🎥 Video`
   - `🎵 Audio`

2. **If you selected Video or Audio:**
   You'll see upload options:
   ```
   ○ Use URL          ● Upload File
   ```

3. **Select "Upload File":**
   - Click **"Choose File"**
   - Select your video (.mp4, .webm, .ogg) or audio (.mp3, .wav, .ogg)
   - Max size: 100MB
   - A progress bar will show during upload

4. **Click "Save Article"**
   - Files will upload automatically
   - Progress bar shows upload status
   - Article is created once upload completes!

---

## 📋 Supported File Types

### **Images (Thumbnail):**
- ✅ JPEG/JPG
- ✅ PNG
- ✅ GIF
- ✅ WebP

### **Videos:**
- ✅ MP4
- ✅ WebM
- ✅ OGG

### **Audio:**
- ✅ MP3
- ✅ WAV
- ✅ OGG

### **File Size Limit:**
- **Maximum:** 100MB per file

---

## 🎬 Example: Creating a Video Article

1. **Login** as Reporter
2. Click **"+ Create New Article"**
3. **Fill in:**
   - **Title:** "Breaking News Video Report"
   - **Category:** Breaking
   - **Content:** "Watch our exclusive coverage..."
   
4. **Upload Thumbnail:**
   - Select **"Upload File"**
   - Choose a thumbnail image from your PC (e.g., `news-thumbnail.jpg`)
   
5. **Select Media Type:**
   - Choose **"🎥 Video"**
   
6. **Upload Video:**
   - Select **"Upload File"**
   - Choose your video file (e.g., `news-report.mp4`)
   - Wait for upload progress bar to complete
   
7. **Set Status:**
   - Choose **"Published"**
   
8. **Click "Save Article"**

9. **Done!** 🎉
   - Go to homepage
   - See your video article with your uploaded content!
   - Hover over it to see autoplay!

---

## 🖼️ Where Are Files Stored?

All uploaded files are stored in:
```
news-platform/uploads/
```

Files are automatically:
- ✅ Given unique names (no conflicts)
- ✅ Organized by type
- ✅ Accessible via `/uploads/filename.ext`
- ✅ Backed up with your database

---

## 🔒 Security Features

✅ **File Type Validation** - Only allowed types accepted  
✅ **Size Limits** - Max 100MB per file  
✅ **Authentication Required** - Only logged-in reporters/admins can upload  
✅ **Unique Filenames** - Prevents overwriting  
✅ **Secure Storage** - Files stored outside public directory  

---

## 💡 Tips

### **For Best Results:**

1. **Thumbnail Images:**
   - Use 1200x675 pixels (16:9 ratio)
   - Keep file size under 500KB for fast loading
   - Use high-quality images

2. **Videos:**
   - Use H.264 codec for MP4 (best compatibility)
   - Recommended resolution: 1920x1080 or 1280x720
   - Compress before uploading for faster loading

3. **Audio:**
   - Use MP3 format (128-320 kbps)
   - Normalize audio levels
   - Trim silence at start/end

---

## ⚠️ Troubleshooting

### **"Upload Failed" Error:**
- Check file size (must be under 100MB)
- Verify file type is supported
- Make sure you're logged in
- Check your internet connection

### **Preview Not Showing:**
- Refresh the page
- Clear browser cache
- Try a different file format

### **Upload is Slow:**
- Large files take time (100MB can take several minutes)
- Don't close the window during upload
- Check your upload speed

---

## 🚀 Advanced: Bulk Upload

Want to upload multiple files at once?

**Future Feature:** Coming soon!
- Drag & drop multiple files
- Batch upload with progress
- Auto-create articles from media

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console (F12)
2. Verify server is running (`npm start`)
3. Check `uploads/` folder permissions
4. Review server logs

---

**Your news platform now supports full local file uploads!** 🎉

No more hunting for URLs - just upload from your PC! 📁➡️☁️

