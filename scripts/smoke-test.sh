#!/usr/bin/env bash
set -euo pipefail

# Simple smoke test for frontend + backend after Vercel deploy
# Usage:
#   DASHBOARD_URL=https://<vercel-app>.vercel.app \
#   BACKEND_URL=https://converto-business-os-quantum-mvp-1.onrender.com \
#   MARKETING_URL=https://converto.fi \
#   ./scripts/smoke-test.sh

RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
NC="\033[0m"

require_var() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo -e "${RED}Missing required env: ${name}${NC}" >&2
    exit 1
  fi
}

require_var DASHBOARD_URL

echo -e "${YELLOW}==> Checking frontend root redirect${NC}"
CODE=$(curl -sS -o /dev/null -w "%{http_code}" -I "$DASHBOARD_URL/")
LOCATION=$(curl -sS -I "$DASHBOARD_URL/" | awk -F": " '/^location:/I{print $2}' | tr -d '\r')
echo "HTTP: $CODE"; [[ -n "$LOCATION" ]] && echo "Location: $LOCATION"
if [[ "$CODE" =~ ^30[1278]$ ]] && [[ "$LOCATION" == */dashboard* ]]; then
  echo -e "${GREEN}✔ Root redirects to /dashboard${NC}"
else
  echo -e "${RED}✖ Root did not redirect to /dashboard (code=$CODE, location=$LOCATION)${NC}"; exit 1
fi

echo -e "${YELLOW}==> Checking /dashboard serves and not static-export${NC}"
DASH_HTML=$(curl -sS "$DASHBOARD_URL/dashboard")
echo "$DASH_HTML" | rg -q "nextExport\"?\s*:\s*true" && { echo -e "${RED}✖ Found nextExport:true in HTML (static export)${NC}"; exit 1; }
HTTP_OK=$(curl -sS -o /dev/null -w "%{http_code}" "$DASHBOARD_URL/dashboard")
if [[ "$HTTP_OK" == "200" ]]; then
  echo -e "${GREEN}✔ /dashboard returns 200 without nextExport:true${NC}"
else
  echo -e "${RED}✖ /dashboard returned HTTP $HTTP_OK${NC}"; exit 1
fi

if [[ -n "${BACKEND_URL:-}" ]]; then
  echo -e "${YELLOW}==> Checking backend health${NC}"
  HEALTH=$(curl -sS "$BACKEND_URL/health" || true)
  echo "$HEALTH" | rg -q '"status"\s*:\s*"healthy"' && \
    echo -e "${GREEN}✔ Backend healthy${NC}" || \
    { echo -e "${RED}✖ Backend health failed${NC}"; exit 1; }
fi

if [[ -n "${MARKETING_URL:-}" ]]; then
  echo -e "${YELLOW}==> Checking marketing URL${NC}"
  M_CODE=$(curl -sS -o /dev/null -w "%{http_code}" "$MARKETING_URL/")
  if [[ "$M_CODE" =~ ^20[0-9]$|^30[1278]$ ]]; then
    echo -e "${GREEN}✔ Marketing URL reachable (HTTP $M_CODE)${NC}"
  else
    echo -e "${RED}✖ Marketing URL returned HTTP $M_CODE${NC}"; exit 1
  fi
fi

echo -e "${GREEN}All smoke tests passed.${NC}"
