#!/usr/bin/env bash
set -euo pipefail

# Deploy backend on Render via API, then poll status and run health check.
# Requires: RENDER_API_KEY env var.
# Optional: RENDER_SERVICE_ID or RENDER_SERVICE_NAME (defaults to "converto-api").
# Usage:
#   RENDER_API_KEY=... ./scripts/render_deploy_backend.sh
#   RENDER_API_KEY=... RENDER_SERVICE_NAME="converto-business-os-quantum-mvp-1" ./scripts/render_deploy_backend.sh
#   RENDER_API_KEY=... RENDER_SERVICE_ID=srv_xxx ./scripts/render_deploy_backend.sh

RED="\033[0;31m"; GREEN="\033[0;32m"; YELLOW="\033[0;33m"; NC="\033[0m"

require() {
  local name="$1"; if [[ -z "${!name:-}" ]]; then echo -e "${RED}Missing env: ${name}${NC}"; exit 1; fi
}

require RENDER_API_KEY

API_BASE="https://api.render.com/v1"
SERVICE_ID="${RENDER_SERVICE_ID:-}"
SERVICE_NAME="${RENDER_SERVICE_NAME:-converto-api}"

header() { echo -e "${YELLOW}==> $*${NC}"; }
ok() { echo -e "${GREEN}✔ $*${NC}"; }
fail() { echo -e "${RED}✖ $*${NC}"; exit 1; }

auth() { curl -sfL -H "Authorization: Bearer $RENDER_API_KEY" -H "Content-Type: application/json" "$@"; }

if [[ -z "$SERVICE_ID" ]]; then
  header "Resolving service id for name: $SERVICE_NAME"
  # shellcheck disable=SC2207
  SERVICE_ID=$(auth "$API_BASE/services" | jq -r \
    --arg n "$SERVICE_NAME" '.[] | select(.service.name==$n) | .service.id' | head -n1)
  if [[ -z "$SERVICE_ID" ]]; then
    echo -e "${RED}Could not resolve service by name: $SERVICE_NAME${NC}"
    echo "Available services (name id type):"
    auth "$API_BASE/services" | jq -r '.[] | "\(.service.name) \(.service.id) \(.service.type)"'
    exit 1
  fi
fi

ok "Using service id: $SERVICE_ID"

header "Triggering deploy"
DEPLOY_JSON=$(auth -X POST "$API_BASE/services/$SERVICE_ID/deploys" --data '{"clearCache":false}') || fail "Trigger deploy failed"
DEPLOY_ID=$(echo "$DEPLOY_JSON" | jq -r '.deploy.id // empty')
[[ -n "$DEPLOY_ID" ]] || fail "No deploy id returned"
ok "Deploy triggered: $DEPLOY_ID"

header "Polling deployment status"
START=$(date +%s)
TIMEOUT=900 # 15 minutes
while true; do
  STATUS_JSON=$(auth "$API_BASE/services/$SERVICE_ID/deploys?limit=1") || true
  STATUS=$(echo "$STATUS_JSON" | jq -r '.[0].deploy.status // empty')
  MSG=$(echo "$STATUS_JSON" | jq -r '.[0].deploy.commit.message // empty')
  echo "status=$STATUS message=${MSG:-}" >/dev/stderr
  case "$STATUS" in
    live|deployed|succeeded)
      ok "Deployment succeeded"
      break
      ;;
    build_failed|update_failed|failed|canceled)
      echo "$STATUS_JSON" | jq -r '.'
      fail "Deployment failed: $STATUS"
      ;;
    "")
      ;;
  esac
  now=$(date +%s); if (( now - START > TIMEOUT )); then fail "Timeout waiting for deploy"; fi
  sleep 5
done

header "Health check"
if [[ -n "${BACKEND_URL:-}" ]]; then
  code=$(curl -sS -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" || true)
  if [[ "$code" == "200" ]]; then ok "Health OK at $BACKEND_URL/health"; else fail "Health check HTTP $code at $BACKEND_URL/health"; fi
else
  echo "(Set BACKEND_URL to run health check)"
fi

ok "Done"
