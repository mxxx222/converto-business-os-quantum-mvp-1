#!/bin/bash
# Render Deploy Script using Render API

RENDER_API_KEY="rnd_WWGcH1dYgaibub32Th7A1DPT4oDg"
RENDER_API_BASE="https://api.render.com/v1"

# Service IDs
BACKEND_SERVICE="srv-d3r10pjipnbc73asaod0"
DASHBOARD_SERVICE="srv-d3rcdnpr0fns73bl3kg0"
MARKETING_SERVICE="srv-d41adhf5r7bs739aqe70"

echo "🚀 Triggering Render Deployments..."
echo ""

# Trigger backend deploy
echo "📦 Backend: converto-business-os-quantum-mvp-1"
curl -X POST "${RENDER_API_BASE}/services/${BACKEND_SERVICE}/deploys" \
  -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Content-Type: application/json" \
  && echo "✅ Backend deploy triggered" || echo "❌ Backend deploy failed"

echo ""

# Trigger dashboard deploy
echo "📦 Dashboard: converto-dashboard"
curl -X POST "${RENDER_API_BASE}/services/${DASHBOARD_SERVICE}/deploys" \
  -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Content-Type: application/json" \
  && echo "✅ Dashboard deploy triggered" || echo "❌ Dashboard deploy failed"

echo ""

# Trigger marketing deploy
echo "📦 Marketing: converto-marketing"
curl -X POST "${RENDER_API_BASE}/services/${MARKETING_SERVICE}/deploys" \
  -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"clearCache": true}' \
  && echo "✅ Marketing deploy triggered" || echo "❌ Marketing deploy failed"

echo ""
echo "✅ All deployments triggered!"
echo ""
echo "📊 Monitor deployments:"
echo "  Backend: https://dashboard.render.com/web/${BACKEND_SERVICE}"
echo "  Dashboard: https://dashboard.render.com/web/${DASHBOARD_SERVICE}"
echo "  Marketing: https://dashboard.render.com/static-sites/${MARKETING_SERVICE}"
