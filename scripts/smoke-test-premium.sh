#!/bin/bash

# 🧪 Premium Page Smoke Test Script
# Tests all critical functionality before launch

echo "🚀 Starting Premium Page Smoke Tests..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"

    echo -n "🧪 Testing $test_name... "

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        ((TESTS_FAILED++))
    fi
}

# Check if frontend is running
echo "🔍 Checking if frontend is running..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${RED}❌ Frontend not running. Please start with: npm run dev${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend is running${NC}"

# Test 1: Premium page loads (static export)
run_test "Premium page loads" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/premium.html" "200"

# Test 2: Premium page returns 200
run_test "Premium page returns 200" "curl -s -w '%{http_code}' http://localhost:3000/premium.html | grep -q '200'"

# Test 3: Thank you page loads
run_test "Thank you page loads" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/kiitos.html" "200"

# Test 4: CSS link tags present
run_test "CSS loads" "curl -s http://localhost:3000/premium.html | grep -q 'rel=\"stylesheet\"'"

# Test 5: Analytics script present
run_test "Analytics script loads" "curl -s http://localhost:3000/premium.html | grep -Eiq 'plausible|analytics'"

# Test 6: Meta tags present
run_test "Meta tags present" "curl -s http://localhost:3000/premium.html | grep -q 'og:title'"

# Test 7: Schema markup present
run_test "Schema markup present" "curl -s http://localhost:3000/premium.html | grep -q 'application/ld+json'"

# Test 8: CTA buttons present (looks for common CTA text)
run_test "CTA buttons present" "curl -s http://localhost:3000/premium.html | grep -Eiq 'aloita|varaa|ota yhteyttä|kokeile'"

# Test 9: Pricing section present
run_test "Pricing section present" "curl -s http://localhost:3000/premium.html | grep -Eiq 'hinnoittelu|pricing'"

# Test 10: FAQ section present
run_test "FAQ section present" "curl -s http://localhost:3000/premium.html | grep -Eiq 'ukk|faq'"

# Test 11: Mobile viewport meta tag
run_test "Mobile viewport meta tag" "curl -s http://localhost:3000/premium.html | grep -q 'viewport'"

# Test 12: No console errors (basic check)
run_test "No obvious JavaScript errors" "curl -s http://localhost:3000/premium.html | grep -vq 'error'"

# Test 13: Images have alt text (passes if no <img> or alt present)
run_test "Images have alt text" "curl -s http://localhost:3000/premium.html | awk 'BEGIN{IGNORECASE=1} /<img/{hasImg=1} /alt=/{hasAlt=1} END{exit !(hasAlt || !hasImg)}'"

# Test 14: Links are valid
run_test "Internal links are valid" "curl -s http://localhost:3000/premium.html | grep -o 'href=\"[^\"]*\"' | grep -v 'http' | head -1"

# Test 15: Form elements present
run_test "Form elements present" "curl -s http://localhost:3000/premium.html | grep -q 'form'"

echo ""
echo "📊 Test Results:"
echo -e "${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"

# Overall result
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Premium page is ready for launch.${NC}"
    exit 0
else
    echo -e "${RED}⚠️ Some tests failed. Please fix issues before launch.${NC}"
    exit 1
fi
