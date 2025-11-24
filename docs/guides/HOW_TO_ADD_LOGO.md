# How to Add Your Logo to the News Website

## Quick Steps

### Option 1: Direct File Upload (Recommended)

1. **Prepare your logo file:**
   - Supported formats: PNG, JPG, JPEG, GIF, SVG, WebP
   - Recommended: PNG with transparent background
   - Optimal size: 200-400px width, maintains aspect ratio
   - File name: `logo.png` (or `logo.jpg`, `logo.svg`, etc.)

2. **Upload your logo:**
   - Copy your logo file to the `news-platform/uploads/` folder
   - Rename it to `logo.png` (or keep your preferred extension)

3. **Update the HTML (if not using logo.png):**
   - Open `news-platform/public/index.html`
   - Find line 35: `<img src="/uploads/logo.png" ...`
   - Change `logo.png` to your filename (e.g., `logo.jpg`, `logo.svg`)

4. **Refresh your browser** to see the logo!

---

### Option 2: Upload via Super Admin Dashboard

1. **Login as Super Admin:**
   - Go to `http://localhost:3000/login`
   - Username: `superadmin`
   - Password: `admin123`

2. **Create a dummy article:**
   - Go to Articles tab
   - Click "New Article"
   - Upload your logo as the thumbnail
   - Submit the article

3. **Find the uploaded file:**
   - Your logo is now in the `uploads/` folder
   - Look for the filename in the browser console or check the folder
   - Copy the filename

4. **Update the logo path:**
   - Open `news-platform/public/index.html`
   - Find line 35: `<img src="/uploads/logo.png" ...`
   - Change to: `<img src="/uploads/YOUR_FILENAME_HERE" ...`

---

## Logo Specifications

### Size Guidelines
- **Height:** Automatically set to 50px (40px on mobile)
- **Width:** Auto-maintained, max 200px (150px on mobile)
- **Aspect Ratio:** Preserved automatically

### Recommended Dimensions
- **Square logos:** 200x200px or 400x400px
- **Wide logos:** 400x100px or 600x150px
- **Tall logos:** 100x200px or 150x300px

### File Format Recommendations
- **Best:** PNG with transparent background
- **Good:** SVG (scalable, small file size)
- **Acceptable:** JPG with white background
- **Avoid:** Very large files (>500KB)

---

## Styling Options

### Change Logo Size
Edit `news-platform/public/styles.css`, find `.site-logo` (around line 224):

```css
.site-logo {
    height: 50px;        /* Change this value */
    width: auto;         /* Keep auto for aspect ratio */
    max-width: 200px;    /* Maximum width */
    object-fit: contain;
    transition: transform 0.2s ease;
}
```

### Remove Site Name (Logo Only)
If you want only the logo without "NewsHub" text:

Edit `news-platform/public/index.html`, line 36:
```html
<!-- Hide the site name -->
<h1 id="siteName" style="display: none;">NewsHub</h1>
```

Or in `styles.css`:
```css
.nav-brand h1 {
    display: none;
}
```

### Adjust Logo Spacing
In `styles.css`, find `.nav-brand` (around line 218):

```css
.nav-brand {
    display: flex;
    align-items: center;
    gap: 15px;  /* Change this for spacing between logo and text */
}
```

---

## Troubleshooting

### Logo not showing?
1. **Check file path:** Make sure the file is in `news-platform/uploads/`
2. **Check filename:** Make sure it matches in the HTML (`logo.png`)
3. **Check permissions:** Make sure the file is readable
4. **Clear browser cache:** Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
5. **Check console:** Open browser DevTools (F12) and check for errors

### Logo too big/small?
- Edit the `height` value in `.site-logo` CSS (line 225)
- Adjust `max-width` if needed (line 227)

### Logo looks stretched?
- Make sure `object-fit: contain;` is set in CSS
- Check your source image aspect ratio

### Logo not hiding when missing?
- The `onerror="this.style.display='none'"` attribute hides the logo if the file doesn't exist
- If you see a broken image icon, check the file path

---

## Example Logo Paths

```html
<!-- PNG logo -->
<img src="/uploads/logo.png" alt="Logo" class="site-logo">

<!-- JPG logo -->
<img src="/uploads/logo.jpg" alt="Logo" class="site-logo">

<!-- SVG logo -->
<img src="/uploads/logo.svg" alt="Logo" class="site-logo">

<!-- Logo with custom name -->
<img src="/uploads/my-company-logo.png" alt="Logo" class="site-logo">
```

---

## Multi-Language Support

The logo will automatically:
- Appear on the right side for Hebrew (RTL)
- Appear on the left side for English/Amharic (LTR)
- Scale appropriately on mobile devices

No additional configuration needed! 🎉

---

## Need Help?

If you encounter any issues:
1. Check the browser console (F12) for error messages
2. Verify the file exists in the `uploads/` folder
3. Make sure the server is running (`npm start`)
4. Try a hard refresh (`Ctrl+Shift+R`)

---

**Ready to add your logo?** Just drop it in the `uploads/` folder as `logo.png` and refresh! 🚀

