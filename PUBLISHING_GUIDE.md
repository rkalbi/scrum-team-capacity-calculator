# Chrome Extension Publishing Guide

## 📋 Pre-Publishing Checklist

### ✅ **Files Ready**
- [x] `manifest.json` - Extension configuration
- [x] `popup.html` - Main interface
- [x] `popup.css` - Styling
- [x] `popup.js` - Functionality
- [x] `icons/` folder with PNG files (16, 32, 48, 128px)
- [x] `PRIVACY_POLICY.md` - Privacy policy
- [x] `README-extension.md` - Documentation

### ✅ **Testing Complete**
- [x] Extension loads without errors
- [x] All features work (team generation, avatars, calculations)
- [x] Dark/light mode toggle works
- [x] CSV export functions
- [x] Resizable interface works
- [x] Data persistence works
- [x] Full app link opens correct URL

## 🚀 Publishing Steps

### **Step 1: Create Developer Account**
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Sign in with your Google account
3. Pay the **$5 one-time registration fee**
4. Complete developer verification

### **Step 2: Prepare Extension Package**
1. **Create a ZIP file** containing:
   ```
   sprint-capacity-planner.zip
   ├── manifest.json
   ├── popup.html
   ├── popup.css
   ├── popup.js
   ├── icons/
   │   ├── icon16.png
   │   ├── icon32.png
   │   ├── icon48.png
   │   └── icon128.png
   └── (no other files needed for store)
   ```

2. **Exclude these files from ZIP:**
   - `index.html` (main web app)
   - `icon-generator.html`
   - `icon-template.svg`
   - `*.md` files
   - Any development files

### **Step 3: Upload Extension**
1. Click **"Add new item"** in Developer Dashboard
2. Upload your ZIP file
3. Fill out the store listing:

#### **Store Listing Details:**
- **Name**: Sprint Capacity Planner
- **Summary**: Smart sprint planning for agile teams with avatars & analytics
- **Description**: Use content from `STORE_DESCRIPTION.md`
- **Category**: Productivity
- **Language**: English

#### **Privacy & Permissions:**
- **Privacy Policy**: Upload `PRIVACY_POLICY.md` content
- **Permissions Justification**:
  - Storage: "Save team configurations and user preferences locally"
  - Downloads: "Export capacity reports as CSV files"

#### **Screenshots (Required - 5 images):**
You'll need to take these screenshots:
1. **Main Interface** - Show sprint configuration form
2. **Team Setup** - Show generated team with avatars
3. **Avatar Selection** - Show avatar picker in action
4. **Results View** - Show capacity calculations with percentages
5. **Dark Mode** - Show the extension in dark theme

### **Step 4: Screenshot Instructions**

**How to take screenshots:**
1. Load your extension in Chrome
2. Open the popup
3. Use browser dev tools or screenshot tool
4. Crop to show just the extension popup
5. Save as PNG, 1280x800 or 640x400 recommended

**Screenshot Requirements:**
- Must be PNG or JPEG
- Minimum 640x400 pixels
- Maximum 1280x800 pixels
- Show actual extension functionality

### **Step 5: Review Process**
- **Initial Review**: 1-3 business days
- **Possible Outcomes**:
  - ✅ **Approved**: Extension goes live immediately
  - ❌ **Rejected**: You'll get feedback to fix issues
  - ⏳ **Additional Review**: May take longer for complex extensions

### **Step 6: Post-Publication**
- **Monitor Reviews**: Respond to user feedback
- **Update Regularly**: Push updates for bug fixes/features
- **Analytics**: Track usage in Developer Dashboard

## 💰 **Costs**
- **Developer Registration**: $5 (one-time)
- **Publishing**: Free
- **Updates**: Free

## 📈 **Marketing Tips**
1. **Share on Social Media**: LinkedIn, Twitter with #agile #scrum hashtags
2. **Product Hunt**: Submit your extension
3. **Developer Communities**: Share in relevant forums
4. **Blog Post**: Write about your development journey
5. **LinkedIn Article**: Target Scrum Masters and Product Owners

## 🔧 **Common Rejection Reasons**
- Missing or inadequate privacy policy
- Unclear permission justifications
- Poor quality screenshots
- Functionality doesn't match description
- Manifest errors

## 📞 **Support Resources**
- [Chrome Web Store Developer Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Extension Publishing Guide](https://developer.chrome.com/docs/webstore/publish/)
- [Developer Dashboard Help](https://support.google.com/chrome_webstore/)

## 🎯 **Success Metrics to Track**
- Weekly active users
- User ratings and reviews
- CSV export usage
- Feature adoption rates
- User retention

---

**Ready to publish?** Follow these steps and your Sprint Capacity Planner will be available to thousands of agile teams worldwide! 🚀