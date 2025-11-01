#!/bin/bash

# 🐳 Modulaarinen Docker Management Script - Converto Business OS
# Käyttö: ./scripts/modular-docker.sh [command] [module]

set -e

# Värit
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funktiot
print_header() {
    echo -e "${BLUE}🐳 Converto Business OS - Modulaarinen Docker Management${NC}"
    echo "=================================================="
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Tarkista Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker ei ole asennettuna!"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose ei ole asennettuna!"
        exit 1
    fi
}

# Näytä käyttöohje
show_help() {
    echo "Käyttö: $0 [command] [module]"
    echo ""
    echo "Komennot:"
    echo "  build [module]     - Rakenna moduuli"
    echo "  start [module]     - Käynnistä moduuli"
    echo "  stop [module]      - Pysäytä moduuli"
    echo "  restart [module]   - Käynnistä moduuli uudelleen"
    echo "  logs [module]      - Näytä logit"
    echo "  status            - Näytä tilanne"
    echo "  clean             - Puhdista Docker-resurssit"
    echo "  dev               - Käynnistä kehitysympäristö"
    echo "  prod              - Käynnistä tuotantoympäristö"
    echo ""
    echo "Moduulit:"
    echo "  marketing         - Marketing App (converto.fi)"
    echo "  dashboard         - Dashboard (asiakkaan hallintapaneeli)"
    echo "  backend           - Backend API"
    echo "  dev-panel         - Dev Panel (kehittäjien työkalut)"
    echo "  all               - Kaikki moduulit"
    echo ""
    echo "Esimerkkejä:"
    echo "  $0 build marketing"
    echo "  $0 start all"
    echo "  $0 logs backend"
    echo "  $0 dev"
}

# Rakenna moduuli
build_module() {
    local module=$1

    print_info "Rakennetaan moduuli: $module"

    case $module in
        "marketing")
            docker-compose -f docker-compose.modular.yml build marketing
            ;;
        "dashboard")
            docker-compose -f docker-compose.modular.yml build dashboard
            ;;
        "backend")
            docker-compose -f docker-compose.modular.yml build backend
            ;;
        "dev-panel")
            docker-compose -f docker-compose.modular.yml build dev-panel
            ;;
        "all")
            docker-compose -f docker-compose.modular.yml build
            ;;
        *)
            print_error "Tuntematon moduuli: $module"
            exit 1
            ;;
    esac

    print_success "Moduuli $module rakennettu onnistuneesti!"
}

# Käynnistä moduuli
start_module() {
    local module=$1

    print_info "Käynnistetään moduuli: $module"

    case $module in
        "marketing")
            docker-compose -f docker-compose.modular.yml up -d marketing
            ;;
        "dashboard")
            docker-compose -f docker-compose.modular.yml up -d dashboard
            ;;
        "backend")
            docker-compose -f docker-compose.modular.yml up -d backend
            ;;
        "dev-panel")
            docker-compose -f docker-compose.modular.yml up -d dev-panel
            ;;
        "all")
            docker-compose -f docker-compose.modular.yml up -d
            ;;
        *)
            print_error "Tuntematon moduuli: $module"
            exit 1
            ;;
    esac

    print_success "Moduuli $module käynnistetty onnistuneesti!"
}

# Pysäytä moduuli
stop_module() {
    local module=$1

    print_info "Pysäytetään moduuli: $module"

    case $module in
        "marketing")
            docker-compose -f docker-compose.modular.yml stop marketing
            ;;
        "dashboard")
            docker-compose -f docker-compose.modular.yml stop dashboard
            ;;
        "backend")
            docker-compose -f docker-compose.modular.yml stop backend
            ;;
        "dev-panel")
            docker-compose -f docker-compose.modular.yml stop dev-panel
            ;;
        "all")
            docker-compose -f docker-compose.modular.yml stop
            ;;
        *)
            print_error "Tuntematon moduuli: $module"
            exit 1
            ;;
    esac

    print_success "Moduuli $module pysäytetty onnistuneesti!"
}

# Käynnistä moduuli uudelleen
restart_module() {
    local module=$1

    print_info "Käynnistetään moduuli uudelleen: $module"

    case $module in
        "marketing")
            docker-compose -f docker-compose.modular.yml restart marketing
            ;;
        "dashboard")
            docker-compose -f docker-compose.modular.yml restart dashboard
            ;;
        "backend")
            docker-compose -f docker-compose.modular.yml restart backend
            ;;
        "dev-panel")
            docker-compose -f docker-compose.modular.yml restart dev-panel
            ;;
        "all")
            docker-compose -f docker-compose.modular.yml restart
            ;;
        *)
            print_error "Tuntematon moduuli: $module"
            exit 1
            ;;
    esac

    print_success "Moduuli $module käynnistetty uudelleen onnistuneesti!"
}

# Näytä logit
show_logs() {
    local module=$1

    print_info "Näytetään logit moduulille: $module"

    case $module in
        "marketing")
            docker-compose -f docker-compose.modular.yml logs -f marketing
            ;;
        "dashboard")
            docker-compose -f docker-compose.modular.yml logs -f dashboard
            ;;
        "backend")
            docker-compose -f docker-compose.modular.yml logs -f backend
            ;;
        "dev-panel")
            docker-compose -f docker-compose.modular.yml logs -f dev-panel
            ;;
        "all")
            docker-compose -f docker-compose.modular.yml logs -f
            ;;
        *)
            print_error "Tuntematon moduuli: $module"
            exit 1
            ;;
    esac
}

# Näytä tilanne
show_status() {
    print_info "Docker-konttien tilanne:"
    echo ""
    docker-compose -f docker-compose.modular.yml ps
    echo ""

    print_info "Palvelut:"
    echo "🌐 Marketing:    http://localhost:3000"
    echo "📊 Dashboard:   http://localhost:3001"
    echo "⚙️  Backend:     http://localhost:8000"
    echo "🛠️  Dev Panel:   http://localhost:3002"
    echo "📊 Prometheus:  http://localhost:9090"
    echo "📈 Grafana:     http://localhost:3003"
}

# Puhdista Docker-resurssit
clean_docker() {
    print_warning "Puhdistetaan Docker-resurssit..."

    # Pysäytä kaikki kontit
    docker-compose -f docker-compose.modular.yml down

    # Poista käyttämättömät kuvat
    docker image prune -f

    # Poista käyttämättömät volyymit
    docker volume prune -f

    print_success "Docker-resurssit puhdistettu!"
}

# Käynnistä kehitysympäristö
start_dev() {
    print_info "Käynnistetään kehitysympäristö..."

    # Kopioi environment-tiedosto jos ei ole olemassa
    if [ ! -f .env ]; then
        cp .env.example .env
        print_warning "Luotu .env-tiedosto .env.example:sta. Muokkaa tarvittaessa."
    fi

    # Käynnistä kaikki palvelut
    docker-compose -f docker-compose.modular.yml up -d

    print_success "Kehitysympäristö käynnistetty!"
    echo ""
    show_status
}

# Käynnistä tuotantoympäristö
start_prod() {
    print_info "Käynnistetään tuotantoympäristö..."

    # Tarkista environment-tiedosto
    if [ ! -f .env ]; then
        print_error ".env-tiedosto puuttuu! Luo se .env.example:sta."
        exit 1
    fi

    # Käynnistä kaikki palvelut
    docker-compose -f docker-compose.modular.yml up -d

    print_success "Tuotantoympäristö käynnistetty!"
    echo ""
    show_status
}

# Pääfunktio
main() {
    print_header

    # Tarkista Docker
    check_docker

    # Käsittele komennot
    case $1 in
        "build")
            if [ -z "$2" ]; then
                print_error "Anna moduuli!"
                show_help
                exit 1
            fi
            build_module $2
            ;;
        "start")
            if [ -z "$2" ]; then
                print_error "Anna moduuli!"
                show_help
                exit 1
            fi
            start_module $2
            ;;
        "stop")
            if [ -z "$2" ]; then
                print_error "Anna moduuli!"
                show_help
                exit 1
            fi
            stop_module $2
            ;;
        "restart")
            if [ -z "$2" ]; then
                print_error "Anna moduuli!"
                show_help
                exit 1
            fi
            restart_module $2
            ;;
        "logs")
            if [ -z "$2" ]; then
                print_error "Anna moduuli!"
                show_help
                exit 1
            fi
            show_logs $2
            ;;
        "status")
            show_status
            ;;
        "clean")
            clean_docker
            ;;
        "dev")
            start_dev
            ;;
        "prod")
            start_prod
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Tuntematon komento: $1"
            show_help
            exit 1
            ;;
    esac
}

# Suorita pääfunktio
main "$@"
