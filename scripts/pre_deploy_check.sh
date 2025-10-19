#!/usr/bin/env bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 PRE-DEPLOYMENT CHECKLIST - Converto™ 2.0"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0
WARN=0

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo "📦 BACKEND CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Python
if command -v python3 &> /dev/null; then
    VERSION=$(python3 --version | cut -d' ' -f2)
    if [[ "$VERSION" == "3.11"* ]] || [[ "$VERSION" == "3.10"* ]] || [[ "$VERSION" == "3.9"* ]]; then
        check_pass "Python version: $VERSION"
    else
        check_warn "Python version: $VERSION (recommend 3.9-3.11)"
    fi
else
    check_fail "Python not found"
fi

# Check requirements.txt
if [ -f "requirements.txt" ]; then
    check_pass "requirements.txt exists"

    # Check for critical packages
    for pkg in fastapi uvicorn sqlalchemy pydantic; do
        if grep -q "^$pkg" requirements.txt; then
            check_pass "  → $pkg found"
        else
            check_fail "  → $pkg missing"
        fi
    done
else
    check_fail "requirements.txt not found"
fi

# Check .env.example
if [ -f ".env.example" ]; then
    check_pass ".env.example exists"
else
    check_warn ".env.example missing (create for docs)"
fi

# Check main.py
if [ -f "app/main.py" ]; then
    check_pass "app/main.py exists"

    # Check for health endpoint
    if grep -q "/health" app/main.py || find app -name "*.py" -exec grep -l "/health" {} \; | head -1 > /dev/null; then
        check_pass "  → Health endpoint found"
    else
        check_fail "  → Health endpoint missing"
    fi

    # Check for CORS
    if grep -q "CORSMiddleware" app/main.py; then
        check_pass "  → CORS configured"
    else
        check_warn "  → CORS not configured"
    fi
else
    check_fail "app/main.py not found"
fi

# Check tests
if [ -d "tests" ]; then
    TEST_COUNT=$(find tests -name "test_*.py" | wc -l | xargs)
    if [ "$TEST_COUNT" -gt 0 ]; then
        check_pass "Tests found ($TEST_COUNT files)"
    else
        check_warn "No test files found"
    fi
else
    check_warn "tests/ directory not found"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ""
echo "🎨 FRONTEND CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "frontend" ]; then
    cd frontend

    # Check Node
    if command -v node &> /dev/null; then
        VERSION=$(node --version)
        check_pass "Node version: $VERSION"
    else
        check_fail "Node not found"
    fi

    # Check package.json
    if [ -f "package.json" ]; then
        check_pass "package.json exists"

        # Check for Next.js
        if grep -q "\"next\":" package.json; then
            check_pass "  → Next.js found"
        else
            check_fail "  → Next.js missing"
        fi

        # Check for dependencies
        for pkg in react typescript tailwindcss; do
            if grep -q "\"$pkg\":" package.json; then
                check_pass "  → $pkg found"
            else
                check_warn "  → $pkg not found"
            fi
        done
    else
        check_fail "package.json not found"
    fi

    # Check build
    if [ -d "node_modules" ]; then
        check_pass "node_modules exists"

        echo "  → Testing build..."
        if npm run build > /tmp/build.log 2>&1; then
            check_pass "  → Build succeeds"
        else
            check_fail "  → Build fails (check /tmp/build.log)"
            tail -20 /tmp/build.log
        fi
    else
        check_warn "node_modules not found (run npm install)"
    fi

    # Check .env.local.example
    if [ -f ".env.local.example" ]; then
        check_pass ".env.local.example exists"
    else
        check_warn ".env.local.example missing"
    fi

    cd ..
else
    check_warn "frontend/ directory not found"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ""
echo "🐳 DEVOPS CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check render.yaml
if [ -f "render.yaml" ]; then
    check_pass "render.yaml exists"

    # Check for database
    if grep -q "databases:" render.yaml; then
        check_pass "  → Database configured"
    else
        check_warn "  → No database (using SQLite?)"
    fi

    # Check for services
    SERVICE_COUNT=$(grep -c "type: web" render.yaml)
    check_pass "  → $SERVICE_COUNT web service(s)"
else
    check_fail "render.yaml not found (required for Render deploy)"
fi

# Check Dockerfile
if [ -f "Dockerfile" ]; then
    check_pass "Dockerfile exists"
else
    check_warn "Dockerfile not found (optional for Render)"
fi

# Check GitHub Actions
if [ -f ".github/workflows/ci.yml" ]; then
    check_pass "CI/CD workflow exists"
else
    check_warn "GitHub Actions not configured"
fi

# Check .gitignore
if [ -f ".gitignore" ]; then
    check_pass ".gitignore exists"

    for pattern in ".env" "node_modules" "__pycache__" ".venv"; do
        if grep -q "$pattern" .gitignore; then
            check_pass "  → $pattern ignored"
        else
            check_warn "  → $pattern not in .gitignore"
        fi
    done
else
    check_fail ".gitignore not found"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ""
echo "📄 DOCUMENTATION CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check README
if [ -f "README.md" ]; then
    LINES=$(wc -l < README.md)
    if [ "$LINES" -gt 50 ]; then
        check_pass "README.md exists ($LINES lines)"
    else
        check_warn "README.md too short ($LINES lines)"
    fi
else
    check_fail "README.md not found"
fi

# Check other docs
for doc in DEPLOYMENT.md API_DOCS.md TROUBLESHOOTING.md; do
    if [ -f "$doc" ]; then
        check_pass "$doc exists"
    else
        check_warn "$doc not found (recommended)"
    fi
done

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ""
echo "🔒 SECURITY CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for secrets in code
if git ls-files | xargs grep -l "sk-proj-" > /dev/null 2>&1; then
    check_fail "OpenAI API key found in code!"
else
    check_pass "No API keys in code"
fi

if git ls-files | xargs grep -l "sk_live_" > /dev/null 2>&1; then
    check_fail "Stripe secret key found in code!"
else
    check_pass "No Stripe keys in code"
fi

# Check .env is ignored
if git ls-files | grep -q "^\.env$"; then
    check_fail ".env file is tracked by git!"
else
    check_pass ".env not tracked by git"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✓ PASSED: $PASS${NC}"
echo -e "${YELLOW}⚠ WARNINGS: $WARN${NC}"
echo -e "${RED}✗ FAILED: $FAIL${NC}"
echo ""

if [ "$FAIL" -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ READY TO DEPLOY TO RENDER!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Next steps:"
    echo "1. git push origin main"
    echo "2. Go to render.com → New → Blueprint"
    echo "3. Select your repo"
    echo "4. Add environment secrets"
    echo "5. Deploy!"
    echo ""
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ FIX FAILURES BEFORE DEPLOYING!${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Fix the $FAIL failed check(s) above, then run again."
    echo ""
    exit 1
fi
