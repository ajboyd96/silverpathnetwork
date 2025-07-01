#!/bin/bash

# Quick deployment script for tree removal website
echo "🌳 Deploying Tree Removal Lead Generation Website"
echo "================================================="

# Navigate to silverpathnetwork directory
cd "/Users/anthonyboyd/Library/Application Support/Claude/silverpathnetwork"

# Create project directory
mkdir -p tree-removal-project
cd tree-removal-project

# Copy files with correct names
echo "📋 Copying website files..."
cp ../tree-removal-index.html ./index.html
cp ../tree-removal-styles.css ./styles.css
cp ../tree-removal-script.js ./script.js
cp ../tree-removal-gas.js ./google-apps-script.js
cp ../tree-removal-readme.md ./README.md

# Create .gitignore
cat > .gitignore << 'EOF'
.env
.DS_Store
*.log
node_modules/
EOF

# Create netlify.toml
cat > netlify.toml << 'EOF'
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"

[[redirects]]
  from = "https://tree-removal-leadgen.netlify.app/*"
  to = "https://tree-removal-leadgen.netlify.app/:splat"
  status = 301!
  force = true
EOF

# Initialize git
echo "🔧 Setting up Git..."
git init
git add .
git commit -m "Initial commit: Tree removal lead generation website with 6-question quiz

Features:
- Mobile-responsive landing page
- Interactive assessment covering tree condition, size, emergency status, property type, access difficulty, and budget
- Automated quote estimation
- Lead capture with validation
- Google Apps Script backend
- Email/Telegram notifications
- Professional TreeCare Pro branding

🤖 Generated with Claude Code"

# Connect to GitHub repository (already created)
git remote add origin https://github.com/ajboyd96/tree-removal-leadgen.git
git branch -M main

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=.

echo ""
echo "✅ Deployment complete!"
echo "📱 GitHub: https://github.com/ajboyd96/tree-removal-leadgen"
echo "🌐 Live site will be available at the Netlify URL shown above"
echo ""
echo "🔧 Next steps:"
echo "1. Set up Google Apps Script using google-apps-script.js"
echo "2. Update the GOOGLE_SCRIPT_URL in script.js"
echo "3. Configure your contact information in index.html"
echo ""
echo "📖 See README.md for complete setup instructions"