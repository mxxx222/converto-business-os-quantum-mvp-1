#!/bin/bash

# 🚀 Release Script - Converto Business OS
# Luo versionit, tagit ja pushaa Docker-kuvat

set -e

# Värit
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfiguraatio
REGISTRY="ghcr.io"
REPO_NAME="converto-business-os"
VERSION_TYPE=${1:-patch} # patch, minor, major
DRY_RUN=${2:-false}

# Funktiot
print_header() {
    echo -e "${BLUE}🚀 Converto Business OS - Release Script${NC}"
    echo "=============================================="
    echo ""
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

# Tarkista git status
check_git_status() {
    print_info "Tarkistetaan git status..."

    if ! git diff-index --quiet HEAD --; then
        print_error "Git working directory ei ole puhdas! Commit tai stash muutokset ensin."
        exit 1
    fi

    if [ "$(git branch --show-current)" != "main" ]; then
        print_warning "Et ole main-branchissa. Oletko varma että haluat tehdä releasen?"
        read -p "Jatketaanko? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    print_success "Git status OK"
}

# Päivitä versio
update_version() {
    print_info "Päivitetään versio ($VERSION_TYPE)..."

    # Lue nykyinen versio
    CURRENT_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "0.0.0")
    print_info "Nykyinen versio: $CURRENT_VERSION"

    # Päivitä versio
    case $VERSION_TYPE in
        "patch")
            NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$3++; print $1"."$2"."$3}')
            ;;
        "minor")
            NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$2++; $3=0; print $1"."$2"."$3}')
            ;;
        "major")
            NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$1++; $2=0; $3=0; print $1"."$2"."$3}')
            ;;
        *)
            print_error "Tuntematon versiotyyppi: $VERSION_TYPE"
            exit 1
            ;;
    esac

    print_info "Uusi versio: $NEW_VERSION"

    # Luo git tag
    if [ "$DRY_RUN" = "false" ]; then
        git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
        print_success "Git tag v$NEW_VERSION luotu"
    else
        print_warning "DRY RUN: Git tag v$NEW_VERSION olisi luotu"
    fi
}

# Rakenna Docker-kuvat
build_images() {
    print_info "Rakennetaan Docker-kuvat..."

    # Rakenna kaikki kuvat
    SERVICES=("marketing" "dashboard" "backend" "dev-panel")

    for service in "${SERVICES[@]}"; do
        print_info "Rakennetaan $service..."

        if [ "$service" = "backend" ]; then
            docker build -t "$REGISTRY/$REPO_NAME/$service:latest" -f ./backend/Dockerfile ./backend
        else
            docker build -t "$REGISTRY/$REPO_NAME/$service:latest" -f ./frontend/Dockerfile.$service ./frontend
        fi

        print_success "$service rakennettu"
    done
}

# Taggaa kuvat
tag_images() {
    print_info "Tagataan Docker-kuvat..."

    SERVICES=("marketing" "dashboard" "backend" "dev-panel")

    for service in "${SERVICES[@]}"; do
        # Taggaa latest
        docker tag "$REGISTRY/$REPO_NAME/$service:latest" "$REGISTRY/$REPO_NAME/$service:latest"

        # Taggaa version
        docker tag "$REGISTRY/$REPO_NAME/$service:latest" "$REGISTRY/$REPO_NAME/$service:v$NEW_VERSION"

        # Taggaa git SHA
        GIT_SHA=$(git rev-parse --short HEAD)
        docker tag "$REGISTRY/$REPO_NAME/$service:latest" "$REGISTRY/$REPO_NAME/$service:$GIT_SHA"

        print_success "$service tagattu"
    done
}

# Pushaa kuvat
push_images() {
    if [ "$DRY_RUN" = "true" ]; then
        print_warning "DRY RUN: Kuvat olisi pushattu registryyn"
        return
    fi

    print_info "Pushataan Docker-kuvat..."

    SERVICES=("marketing" "dashboard" "backend" "dev-panel")

    for service in "${SERVICES[@]}"; do
        print_info "Pushataan $service..."

        # Pushaa kaikki tagit
        docker push "$REGISTRY/$REPO_NAME/$service:latest"
        docker push "$REGISTRY/$REPO_NAME/$service:v$NEW_VERSION"
        docker push "$REGISTRY/$REPO_NAME/$service:$GIT_SHA"

        print_success "$service pushattu"
    done
}

# Päivitä docker-compose.yml
update_compose() {
    print_info "Päivitetään docker-compose.yml..."

    # Päivitä image tagit
    sed -i.bak "s|image: converto-|image: $REGISTRY/$REPO_NAME/|g" docker-compose.modular.yml
    sed -i.bak "s|:latest|:v$NEW_VERSION|g" docker-compose.modular.yml

    print_success "docker-compose.yml päivitetty"
}

# Luo release notes
create_release_notes() {
    print_info "Luodaan release notes..."

    RELEASE_NOTES="## Converto Business OS v$NEW_VERSION

### Changes
- Automated release $(date '+%Y-%m-%d %H:%M:%S')

### Docker Images
- \`$REGISTRY/$REPO_NAME/marketing:v$NEW_VERSION\`
- \`$REGISTRY/$REPO_NAME/dashboard:v$NEW_VERSION\`
- \`$REGISTRY/$REPO_NAME/backend:v$NEW_VERSION\`
- \`$REGISTRY/$REPO_NAME/dev-panel:v$NEW_VERSION\`

### Quick Start
\`\`\`bash
# Pull latest images
docker-compose -f docker-compose.modular.yml pull

# Start services
make up
\`\`\`"

    echo "$RELEASE_NOTES" > "RELEASE_v$NEW_VERSION.md"
    print_success "Release notes luotu: RELEASE_v$NEW_VERSION.md"
}

# Pääfunktio
main() {
    print_header

    # Tarkista git status
    check_git_status

    # Päivitä versio
    update_version

    # Rakenna kuvat
    build_images

    # Taggaa kuvat
    tag_images

    # Pushaa kuvat
    push_images

    # Päivitä compose
    update_compose

    # Luo release notes
    create_release_notes

    print_success "Release v$NEW_VERSION valmis!"
    echo ""
    print_info "Seuraavat vaiheet:"
    echo "  1. git push origin main --tags"
    echo "  2. Deployaa tuotantoon"
    echo "  3. Testaa deployment"
}

# Näytä apua
show_help() {
    echo "Käyttö: $0 [version_type] [dry_run]"
    echo ""
    echo "Version types:"
    echo "  patch  - Päivitä patch versio (0.0.1 -> 0.0.2)"
    echo "  minor  - Päivitä minor versio (0.0.1 -> 0.1.0)"
    echo "  major  - Päivitä major versio (0.0.1 -> 1.0.0)"
    echo ""
    echo "Options:"
    echo "  dry_run - true/false (default: false)"
    echo ""
    echo "Esimerkkejä:"
    echo "  $0 patch false     # Päivitä patch versio"
    echo "  $0 minor true      # Päivitä minor versio (dry run)"
    echo "  $0 major false     # Päivitä major versio"
}

# Käsittele argumentit
if [ "$1" = "help" ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# Suorita pääfunktio
main
