# 🎨 E1 Logo Configuration

## Default Logo Text

**Text:** `E1`  
**Font:** Times New Roman (Headings CS)  
**Style:** Bold 900  
**Color:** White on red gradient background  

## CSS Configuration

```css
.logo-text {
    font-size: 72px;
    font-weight: 900;
    letter-spacing: -3px;
    font-family: 'Times New Roman', Times, serif;
    line-height: 1;
    color: white;
    background: linear-gradient(135deg, #c90012 0%, #e30613 100%);
}
```

## Usage

The logo automatically displays "E1" in Times New Roman font across all pages:
- Homepage
- Article pages
- Login page
- Admin pages
- All other pages

## Customization

To change the site name:
1. Login as superadmin
2. Go to Site Settings
3. Change "Site Name" field
4. The logo will update to show initials or custom text

## Default Behavior

- **If no custom name set:** Shows "E1"
- **If custom name set:** Shows initials (first letters of words)
- **Font:** Always Times New Roman
- **Style:** Always bold with red background

## Visual Style

```
┌────────────────┐
│                │
│      E1       │  ← White text, Times New Roman, Bold
│                │
└────────────────┘
     RED
   GRADIENT
   BACKGROUND
```

## Logo Subtitle

Below the main logo, "NEWS" appears in smaller text.

**Complete logo:**
```
   E1
  NEWS
```

---

**Status:** ✅ Configured and deployed
**Last Updated:** November 2025

