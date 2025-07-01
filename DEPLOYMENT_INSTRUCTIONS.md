# Tree Removal Website Deployment Instructions

## Files Created
Your tree removal lead generation website has been created with these files:

- `tree-removal-index.html` - Main landing page
- `tree-removal-styles.css` - Complete styling system  
- `tree-removal-script.js` - Quiz functionality and lead capture
- `tree-removal-gas.js` - Google Apps Script backend
- `tree-removal-readme.md` - Complete documentation

## Step 1: GitHub Setup

### Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click "New Repository" 
3. Name it: `tree-removal-leadgen`
4. Make it Public
5. Don't initialize with README (we'll push existing files)
6. Click "Create Repository"

### Push Files to GitHub
Run these commands in your terminal from the silverpathnetwork directory:

```bash
# Navigate to your project directory
cd "/Users/anthonyboyd/Library/Application Support/Claude/silverpathnetwork"

# Create new repository for tree removal files only
mkdir tree-removal-leadgen
cd tree-removal-leadgen

# Copy the tree removal files
cp ../tree-removal-index.html ./index.html
cp ../tree-removal-styles.css ./styles.css  
cp ../tree-removal-script.js ./script.js
cp ../tree-removal-gas.js ./google-apps-script.js
cp ../tree-removal-readme.md ./README.md

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Tree removal lead generation website

- Professional landing page with mobile-responsive design
- Interactive 6-question assessment quiz
- Automated quote estimation based on responses
- Lead capture forms with validation
- Google Apps Script backend integration
- Email and Telegram notifications
- Complete documentation and setup instructions

🌳 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Add your GitHub repository as remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/tree-removal-leadgen.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Google Apps Script Setup

### 1. Create Google Apps Script Project
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy and paste the code from `google-apps-script.js`
5. Save the project as "Tree Removal Lead Handler"

### 2. Configure Settings
Update the CONFIG object in your Google Apps Script:

```javascript
const CONFIG = {
  SPREADSHEET_ID: 'your-google-sheets-id-here',
  TELEGRAM_BOT_TOKEN: 'your-telegram-bot-token', 
  TELEGRAM_CHAT_ID: 'your-telegram-chat-id',
  NOTIFICATION_EMAIL: 'your-email@example.com',
  SMS_PHONE: '5551234567'
};
```

### 3. Deploy Web App
1. Click "Deploy" > "New deployment"
2. Choose "Web app" as type
3. Set execute as "Me"
4. Set access to "Anyone"
5. Click "Deploy"
6. Copy the web app URL

### 4. Update Website Script
1. Open `script.js` in your GitHub repository
2. Find the line: `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`
3. Replace with your actual Google Apps Script URL
4. Commit and push the change

## Step 3: Google Sheets Setup

### 1. Create Google Sheets
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Tree Removal Leads"
4. Copy the spreadsheet ID from the URL
5. Update the SPREADSHEET_ID in your Google Apps Script

The script will automatically create the proper sheet structure with headers.

## Step 4: Telegram Bot Setup (Optional)

### 1. Create Telegram Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot`
3. Choose a name for your bot
4. Choose a username ending in "bot"
5. Copy the bot token

### 2. Get Chat ID
1. Message [@userinfobot](https://t.me/userinfobot) 
2. Copy your chat ID
3. Update both values in your Google Apps Script CONFIG

## Step 5: Netlify Deployment

### 1. Connect GitHub to Netlify
1. Go to [netlify.com](https://www.netlify.com)
2. Sign up/login with GitHub
3. Click "New site from Git"
4. Choose GitHub and authorize
5. Select your `tree-removal-leadgen` repository

### 2. Configure Build Settings
- **Build command:** Leave empty (static site)
- **Publish directory:** `/` (root directory)
- **Branch to deploy:** `main`

### 3. Deploy Site
1. Click "Deploy site"
2. Wait for deployment to complete
3. Your site will be live at a random Netlify URL
4. Optionally, configure a custom domain

### 4. Configure Custom Domain (Optional)
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions

## Step 6: Testing Your Website

### 1. Test Quiz Flow
1. Visit your live website
2. Click "Get Free Quote"
3. Complete all 6 questions
4. Fill out the contact form
5. Submit and verify thank you message

### 2. Test Backend Integration
1. Check your Google Sheets for new lead data
2. Verify email notification was sent
3. Check Telegram for notification (if configured)
4. Test the Google Apps Script directly using the test function

### 3. Mobile Testing
1. Test on various mobile devices
2. Verify responsive design
3. Check form functionality on touch devices
4. Test quiz navigation

## Step 7: Final Configuration

### 1. Update Contact Information
Edit these in your `index.html`:
- Company name (currently "TreeCare Pro")
- Phone number (currently "(555) 123-TREE")
- Email address (currently "info@treecarepro.com")

### 2. Customize Branding
Edit `styles.css` to match your brand:
- Colors (CSS variables at top of file)
- Fonts
- Logo/imagery

### 3. SEO Optimization
- Update meta descriptions
- Add Google Analytics
- Submit sitemap to Google Search Console
- Optimize for local SEO

## Troubleshooting

### Common Issues:
1. **Quiz not submitting:** Check Google Apps Script URL in script.js
2. **No notifications:** Verify email/Telegram configuration
3. **CORS errors:** Ensure Google Apps Script is deployed with "Anyone" access
4. **Mobile issues:** Test responsive breakpoints

### Support:
- Check browser console for JavaScript errors
- Review Google Apps Script execution logs
- Test backend with the included test function
- Verify all configuration values are correct

## Security Checklist

- ✅ HTTPS enabled (Netlify provides this automatically)
- ✅ Form validation implemented
- ✅ Google Apps Script properly secured
- ✅ No sensitive data exposed in frontend code
- ✅ CORS properly configured

Your tree removal lead generation website is now ready to capture and manage leads professionally! 🌳

## Next Steps

1. Set up Google Analytics for tracking
2. Configure additional lead sources (social media, ads)
3. Set up automated follow-up sequences
4. Add customer testimonials and reviews
5. Optimize for local search results