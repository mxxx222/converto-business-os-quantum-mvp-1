#!/bin/bash
# Converto 2.0 - Quick Deploy to Render
# Usage: ./scripts/quick_deploy.sh

set -e

echo "🚀 CONVERTO 2.0 - QUICK DEPLOY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run checklist first
echo "Running pre-deployment checklist..."
./scripts/deploy_checklist.sh

# Ensure we're on main branch
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
    echo "⚠️  Not on main branch (currently on: $BRANCH)"
    read -p "Switch to main? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
    else
        echo "Aborted."
        exit 1
    fi
fi

# Pull latest
echo ""
echo "📥 Pulling latest changes..."
git pull origin main

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push origin main

# Push to Render (if render remote exists)
if git remote | grep -q render; then
    echo ""
    echo "🚀 Deploying to Render..."
    git push render main

    echo ""
    echo "✅ Deployment triggered!"
    echo ""
    echo "Monitor deployment:"
    echo "  https://dashboard.render.com"
    echo ""
    echo "Once deployed, check:"
    echo "  Backend:  https://api.converto.fi/health"
    echo "  Frontend: https://app.converto.fi"
else
    echo ""
    echo "⚠️  Render remote not configured"
    echo ""
    echo "Add Render remote:"
    echo "  git remote add render https://git.render.com/srv-YOUR-SERVICE-ID.git"
    echo ""
    echo "Then run this script again."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
