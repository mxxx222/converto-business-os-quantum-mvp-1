#!/usr/bin/env bash
set -euo pipefail

red() { printf "\033[31m%s\033[0m\n" "$*"; }
green() { printf "\033[32m%s\033[0m\n" "$*"; }
yellow() { printf "\033[33m%s\033[0m\n" "$*"; }

ok=0; fail=0

check() {
  local name="$1" url="$2" expect="${3:-200}"
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
  if [ "$code" = "$expect" ]; then
    green "✓ $name ($url) -> $code"; ok=$((ok+1))
  else
    red "✗ $name ($url) -> $code (expected $expect)"; fail=$((fail+1));
  fi
}

MARKETING_URL="${MARKETING_URL:-https://converto.fi}"
DASHBOARD_URL="${DASHBOARD_URL:-https://app.converto.fi}"
BACKEND_URL="${BACKEND_URL:-https://converto-business-os-quantum-mvp-1.onrender.com}"
HEALTH_PATH="${HEALTH_PATH:-/health}"

yellow "Running smoke test…"

check "Marketing /"           "$MARKETING_URL/" 200
check "Marketing sitemap.xml" "$MARKETING_URL/sitemap.xml" 200
check "Marketing robots.txt"  "$MARKETING_URL/robots.txt" 200
check "Dashboard /"           "$DASHBOARD_URL/" 200
check "Backend health"        "$BACKEND_URL$HEALTH_PATH" 200

yellow "OK: $ok, FAIL: $fail"
[ "$fail" -eq 0 ]
