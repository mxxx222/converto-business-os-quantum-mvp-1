#!/bin/bash

# 🧪 Smoke Test Script - Converto Business OS
# Testaa kaikkien palvelujen terveyden ja toimivuuden

set -e

# Värit
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfiguraatio
BASE_URL="http://localhost"
TIMEOUT=10
RETRIES=3

# Testitulokset
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Funktiot
print_header() {
    echo -e "${BLUE}🧪 Converto Business OS - Smoke Test${NC}"
    echo "=========================================="
    echo ""
}

print_test() {
    local service=$1
    local url=$2
    local expected_code=$3

    echo -n "Testing $service ($url)... "
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

print_success() {
    echo -e "${GREEN}✅ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
}

print_failure() {
    echo -e "${RED}❌ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
}

print_warning() {
    echo -e "${YELLOW}⚠️  WARN${NC}"
}

# HTTP test funktio
test_http() {
    local service=$1
    local url=$2
    local expected_code=$3
    local method=${4:-GET}

    print_test "$service" "$url" "$expected_code"

    for i in $(seq 1 $RETRIES); do
        if response=$(curl -s -w "%{http_code}" -o /dev/null -X "$method" --connect-timeout $TIMEOUT "$url" 2>/dev/null); then
            if [ "$response" = "$expected_code" ]; then
                print_success
                return 0
            else
                if [ $i -eq $RETRIES ]; then
                    echo -e "${RED}(Expected: $expected_code, Got: $response)${NC}"
                    print_failure
                    return 1
                fi
            fi
        else
            if [ $i -eq $RETRIES ]; then
                echo -e "${RED}(Connection failed)${NC}"
                print_failure
                return 1
            fi
        fi
        sleep 2
    done
}

# Tarkista Docker-kontit
check_containers() {
    echo -e "${BLUE}📦 Checking Docker containers...${NC}"

    local containers=("converto-postgres" "converto-redis" "converto-backend" "converto-marketing" "converto-dashboard" "converto-dev-panel")

    for container in "${containers[@]}"; do
        if docker ps --format "table {{.Names}}" | grep -q "^$container$"; then
            echo -e "  ${GREEN}✅ $container${NC}"
        else
            echo -e "  ${RED}❌ $container${NC}"
            echo -e "${RED}Error: Container $container is not running!${NC}"
            exit 1
        fi
    done
    echo ""
}

# Tarkista palvelujen terveys
check_health() {
    echo -e "${BLUE}🏥 Checking service health...${NC}"

    # Backend API
    test_http "Backend API" "$BASE_URL:8000/health" "200"

    # Marketing App
    test_http "Marketing App" "$BASE_URL:3000/health" "200"

    # Dashboard
    test_http "Dashboard" "$BASE_URL:3001/health" "200"

    # Dev Panel
    test_http "Dev Panel" "$BASE_URL:3002/health" "200"

    echo ""
}

# Tarkista pääsivut
check_main_pages() {
    echo -e "${BLUE}🌐 Checking main pages...${NC}"

    # Marketing App pääsivu
    test_http "Marketing Home" "$BASE_URL:3000" "200"

    # Dashboard pääsivu
    test_http "Dashboard Home" "$BASE_URL:3001" "200"

    # Dev Panel pääsivu
    test_http "Dev Panel Home" "$BASE_URL:3002" "200"

    echo ""
}

# Tarkista API-endpointit
check_api_endpoints() {
    echo -e "${BLUE}🔌 Checking API endpoints...${NC}"

    # Backend API endpoints
    test_http "Backend Health" "$BASE_URL:8000/health" "200"
    test_http "Backend API Root" "$BASE_URL:8000/" "200"

    # Testaa että API vastaa JSON:ia
    print_test "Backend API JSON" "$BASE_URL:8000/health" "200"
    if response=$(curl -s --connect-timeout $TIMEOUT "$BASE_URL:8000/health" 2>/dev/null); then
        if echo "$response" | grep -q "healthy\|status"; then
            print_success
        else
            print_failure
        fi
    else
        print_failure
    fi

    echo ""
}

# Tarkista monitoring
check_monitoring() {
    echo -e "${BLUE}📊 Checking monitoring services...${NC}"

    # Prometheus
    test_http "Prometheus" "$BASE_URL:9090" "200"

    # Grafana
    test_http "Grafana" "$BASE_URL:3003" "200"

    echo ""
}

# Tarkista tietokanta
check_database() {
    echo -e "${BLUE}🗄️ Checking database connection...${NC}"

    print_test "PostgreSQL" "postgres:5432" "200"
    if docker-compose -f docker-compose.modular.yml exec -T postgres pg_isready -U converto -d converto >/dev/null 2>&1; then
        print_success
    else
        print_failure
    fi

    print_test "Redis" "redis:6379" "200"
    if docker-compose -f docker-compose.modular.yml exec -T redis redis-cli ping >/dev/null 2>&1; then
        print_success
    else
        print_failure
    fi

    echo ""
}

# Tarkista logit
check_logs() {
    echo -e "${BLUE}📝 Checking service logs...${NC}"

    local services=("backend" "marketing" "dashboard" "dev-panel")

    for service in "${services[@]}"; do
        print_test "$service logs" "docker logs" "200"
        if docker-compose -f docker-compose.modular.yml logs --tail=10 "$service" >/dev/null 2>&1; then
            print_success
        else
            print_failure
        fi
    done

    echo ""
}

# Tarkista resurssien käyttö
check_resources() {
    echo -e "${BLUE}💾 Checking resource usage...${NC}"

    print_test "Docker stats" "docker stats" "200"
    if docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep -q "converto"; then
        print_success
    else
        print_failure
    fi

    echo ""
}

# Yhteenveto
print_summary() {
    echo -e "${BLUE}📊 Test Summary${NC}"
    echo "=================="
    echo -e "Total tests: $TOTAL_TESTS"
    echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
    echo -e "${RED}Failed: $FAILED_TESTS${NC}"
    echo ""

    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed! System is healthy.${NC}"
        exit 0
    else
        echo -e "${RED}❌ Some tests failed. Check the output above.${NC}"
        exit 1
    fi
}

# Pääfunktio
main() {
    print_header

    # Tarkista että Docker on käynnissä
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running!${NC}"
        exit 1
    fi

    # Suorita testit
    check_containers
    check_database
    check_health
    check_main_pages
    check_api_endpoints
    check_monitoring
    check_logs
    check_resources

    print_summary
}

# Suorita pääfunktio
main "$@"
