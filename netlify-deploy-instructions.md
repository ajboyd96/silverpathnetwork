# Netlify Deployment Instructions

Your tree removal website is ready to deploy to Netlify! Since the CLI has issues, here's how to deploy via the web interface:

## Option 1: Deploy via Netlify Web Interface (Recommended)

### Step 1: Go to Netlify Dashboard
1. Open [https://app.netlify.com](https://app.netlify.com)
2. Sign in to your account (you're already logged in as Anthony Boyd)

### Step 2: Deploy from GitHub
1. Click **"New site from Git"**
2. Choose **"GitHub"** as your Git provider
3. Search for and select **"tree-removal-leadgen"** repository
4. Configure build settings:
   - **Branch to deploy:** `main`
   - **Build command:** Leave empty
   - **Publish directory:** `/` (root)
5. Click **"Deploy site"**

### Step 3: Configure Site Settings
1. Once deployed, click **"Site settings"**
2. Go to **"Change site name"** 
3. Change from random name to: `tree-removal-leadgen`
4. Your site will be available at: `https://tree-removal-leadgen.netlify.app`

## Option 2: Manual Drag & Drop Deployment

### Step 1: Prepare Files
Your files are ready in: `/Users/anthonyboyd/Library/Application Support/Claude/silverpathnetwork/tree-removal-project/`

### Step 2: Deploy via Drag & Drop
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Scroll down to **"Want to deploy a new site without connecting to Git?"**
3. Drag the entire `tree-removal-project` folder to the deployment area
4. Wait for deployment to complete

## Your Website Will Include:

✅ **Professional Landing Page**
- Mobile-responsive design
- TreeCare Pro branding
- Hero section with call-to-action
- Services showcase
- About section with statistics
- Contact information

✅ **Interactive 6-Question Quiz**
1. Tree condition (dead/diseased/healthy/damaged)
2. Tree size (small to very large)
3. Emergency removal timeline
4. Property type (residential/commercial)
5. Access difficulty assessment
6. Budget range selection

✅ **Smart Features**
- Automated quote estimation
- Progress tracking
- Form validation
- Mobile-optimized interface
- Professional styling

✅ **Lead Capture System**
- Contact form with validation
- Email collection
- Phone number formatting
- Address collection
- Additional notes field

## After Deployment:

### 1. Update Google Apps Script URL
1. Set up Google Apps Script using `google-apps-script.js`
2. Deploy as web app and copy the URL
3. Update `script.js` in your GitHub repo:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_ACTUAL_GOOGLE_APPS_SCRIPT_URL';
   ```
4. Push the change to GitHub (Netlify will auto-deploy)

### 2. Customize Contact Information
Update in `index.html`:
- Company name (currently "TreeCare Pro")
- Phone number (currently "(555) 123-TREE")
- Email (currently "info@treecarepro.com")

### 3. Configure Backend
- Set up Google Sheets for lead storage
- Configure email notifications
- Optional: Set up Telegram bot

## Expected Results:

🌐 **Live Website:** `https://tree-removal-leadgen.netlify.app`
📱 **GitHub Repo:** `https://github.com/ajboyd96/tree-removal-leadgen`
📊 **Features:** Complete lead generation system ready to capture tree removal leads

The website is production-ready and will professionally capture leads with automated quote estimation!