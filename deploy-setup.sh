#!/bin/bash

# Tree Removal Website Deployment Script
# Run this script to set up GitHub repository and prepare for Netlify

echo "🌳 Setting up Tree Removal Lead Generation Website Deployment"
echo "============================================================"

# Create project directory
echo "📁 Creating project directory..."
mkdir -p tree-removal-leadgen
cd tree-removal-leadgen

# Copy files with proper names for deployment
echo "📋 Copying website files..."
cp ../tree-removal-index.html ./index.html
cp ../tree-removal-styles.css ./styles.css
cp ../tree-removal-script.js ./script.js
cp ../tree-removal-gas.js ./google-apps-script.js
cp ../tree-removal-readme.md ./README.md
cp ../DEPLOYMENT_INSTRUCTIONS.md ./DEPLOYMENT.md

# Create .gitignore
echo "🔒 Creating .gitignore..."
cat > .gitignore << EOF
# Environment variables
.env
.env.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log

# Temporary files
*.tmp
*.temp
EOF

# Create netlify.toml for deployment configuration
echo "⚙️ Creating Netlify configuration..."
cat > netlify.toml << EOF
[build]
  publish = "."
  
[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[redirects]]
  from = "/tree-removal-index.html"
  to = "/index.html"
  status = 301
EOF

# Initialize git repository
echo "🔧 Initializing Git repository..."
git init

# Add all files
echo "➕ Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Tree removal lead generation website

✨ Features:
- Professional mobile-responsive landing page
- Interactive 6-question assessment quiz covering:
  * Tree condition (dead/diseased/healthy)
  * Tree size (small to very large)
  * Emergency removal timing
  * Property type (residential/commercial)
  * Access difficulty assessment
  * Budget range selection
- Automated quote estimation based on responses
- Lead capture forms with real-time validation
- Google Apps Script backend integration
- Email and Telegram notification system
- Google Sheets lead management
- Priority scoring system
- Ready-to-send text message templates

🏗️ Built with HTML5, CSS3, and vanilla JavaScript
📱 Mobile-first responsive design
🔒 Security features and form validation
📊 Complete lead tracking and management

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

echo ""
echo "✅ Repository setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Create a GitHub repository at https://github.com/new"
echo "2. Name it: tree-removal-leadgen"
echo "3. Run these commands to push:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/tree-removal-leadgen.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Then connect to Netlify at https://app.netlify.com/start"
echo ""
echo "📁 Your files are ready in: $(pwd)"
echo "📖 See DEPLOYMENT.md for complete instructions"