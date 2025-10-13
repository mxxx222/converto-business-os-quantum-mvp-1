#!/bin/bash
# Converto 2.0 - Pre-Deployment Checklist
# Run this before deploying to production

set -e

echo "🚀 CONVERTO 2.0 - DEPLOYMENT CHECKLIST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CHECKS_PASSED=0
CHECKS_FAILED=0

check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅${NC} $1"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}❌${NC} $1"
        ((CHECKS_FAILED++))
    fi
}

warn() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

# ========================================
# 1. ENVIRONMENT CHECKS
# ========================================
echo "📋 1. ENVIRONMENT CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Python version
python3 --version | grep -q "Python 3" && check "Python 3.x installed" || check "Python 3.x NOT found"

# Check if .env exists
test -f .env && check ".env file exists" || check ".env file MISSING"

# Check critical env vars
if [ -f .env ]; then
    source .env
    [ ! -z "$DATABASE_URL" ] && check "DATABASE_URL set" || check "DATABASE_URL MISSING"
    [ ! -z "$OPENAI_API_KEY" ] && check "OPENAI_API_KEY set" || check "OPENAI_API_KEY MISSING"
    [ ! -z "$JWT_SECRET" ] && check "JWT_SECRET set" || check "JWT_SECRET MISSING"
fi

echo ""

# ========================================
# 2. DEPENDENCIES
# ========================================
echo "📦 2. DEPENDENCIES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if venv exists
test -d venv && check "Virtual environment exists" || check "Virtual environment MISSING"

# Check key dependencies
python3 -c "import fastapi" 2>/dev/null && check "FastAPI installed" || check "FastAPI NOT installed"
python3 -c "import pyjwt" 2>/dev/null && check "PyJWT installed" || check "PyJWT NOT installed"
python3 -c "import yaml" 2>/dev/null && check "PyYAML installed" || check "PyYAML NOT installed"

echo ""

# ========================================
# 3. CONFIGURATION FILES
# ========================================
echo "⚙️  3. CONFIGURATION FILES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test -f config/pricing_tiers.yaml && check "pricing_tiers.yaml exists" || check "pricing_tiers.yaml MISSING"
test -f frontend/middleware.ts && check "middleware.ts exists" || check "middleware.ts MISSING"
test -f frontend/public/manifest.json && check "manifest.json exists" || check "manifest.json MISSING"

echo ""

# ========================================
# 4. DEMO DATA
# ========================================
echo "📊 4. DEMO DATA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test -f data/demo/receipts.json && check "Demo receipts seeded" || check "Demo receipts MISSING"
test -f data/demo/impact.json && check "Demo impact seeded" || check "Demo impact MISSING"
test -f data/demo/gamify.json && check "Demo gamify seeded" || check "Demo gamify MISSING"

echo ""

# ========================================
# 5. FRONTEND BUILD
# ========================================
echo "🎨 5. FRONTEND BUILD"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test -d frontend/node_modules && check "Node modules installed" || check "Node modules MISSING (run: npm install)"
test -f frontend/.next/BUILD_ID && check "Frontend built" || warn "Frontend not built (run: npm run build)"

echo ""

# ========================================
# 6. DOCKER
# ========================================
echo "🐳 6. DOCKER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

command -v docker >/dev/null 2>&1 && check "Docker installed" || warn "Docker NOT installed"
test -f docker-compose.yml && check "docker-compose.yml exists" || check "docker-compose.yml MISSING"
test -f Dockerfile && check "Dockerfile exists" || check "Dockerfile MISSING"

echo ""

# ========================================
# 7. GIT STATUS
# ========================================
echo "📝 7. GIT STATUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

git status --short | grep -q . && warn "Uncommitted changes detected" || check "Working tree clean"
git remote -v | grep -q origin && check "Git remote configured" || check "Git remote MISSING"

echo ""

# ========================================
# 8. SECURITY
# ========================================
echo "🔒 8. SECURITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test -f .gitignore && check ".gitignore exists" || check ".gitignore MISSING"
grep -q ".env" .gitignore && check ".env in .gitignore" || check ".env NOT in .gitignore"
grep -q "node_modules" .gitignore && check "node_modules in .gitignore" || check "node_modules NOT in .gitignore"

echo ""

# ========================================
# SUMMARY
# ========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}❌ Failed: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED - READY FOR DEPLOYMENT!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Deploy to Render: git push render main"
    echo "  2. Configure environment variables in Render dashboard"
    echo "  3. Run migrations: render run alembic upgrade head"
    echo "  4. Test production URL"
    echo "  5. Submit to App Store & Play Store"
    exit 0
else
    echo -e "${RED}⚠️  SOME CHECKS FAILED - FIX BEFORE DEPLOYING${NC}"
    echo ""
    echo "Common fixes:"
    echo "  - Missing .env: cp .env.example .env"
    echo "  - Missing deps: pip install -r requirements.txt"
    echo "  - Uncommitted changes: git add -A && git commit -m 'fix'"
    exit 1
fi

