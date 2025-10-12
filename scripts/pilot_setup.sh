#!/usr/bin/env bash
# Pilot Customer Setup Script - "Aja ja valmis"
# Usage: ./scripts/pilot_setup.sh [ENV_VARS...]
# Example: ./scripts/pilot_setup.sh PILOT_TENANT_ID=tenant_acme_001 PILOT_TENANT_NAME="Acme Oy"

set -euo pipefail

# ---- CONFIG (muokkaa tarvittaessa tai anna ympäristömuuttujina) ----
PILOT_TENANT_ID="${PILOT_TENANT_ID:-tenant_acme_001}"
PILOT_TENANT_NAME="${PILOT_TENANT_NAME:-Acme Oy}"
PILOT_ADMIN_EMAIL="${PILOT_ADMIN_EMAIL:-ceo@acme.fi}"
DEV_JWT_SECRET="${DEV_JWT_SECRET:-devsecret123}"

BACKEND_URL="${BACKEND_URL:-https://converto-backend.onrender.com}"
FRONTEND_URL="${FRONTEND_URL:-https://converto-frontend.onrender.com}"

# Stripe (valinnaiset, vain tulostusta varten)
STRIPE_PRICE_LITE="${STRIPE_PRICE_LITE:-price_lite}"
STRIPE_PRICE_PRO="${STRIPE_PRICE_PRO:-price_pro}"
STRIPE_PRICE_INSIGHTS="${STRIPE_PRICE_INSIGHTS:-price_insights}"

echo "🚀 Setting up pilot customer..."
echo ""
echo "Company:    $PILOT_TENANT_NAME"
echo "Email:      $PILOT_ADMIN_EMAIL"
echo "Tenant ID:  $PILOT_TENANT_ID"
echo ""

# ---- Ensure env & venv ----
if [ -f ".env" ]; then
  set -a; source .env; set +a
fi

python3 -c 'import sys; exit(0) if sys.version_info[:2]>=(3,9) else exit(1)' || {
  echo "❌ Python ≥3.9 vaaditaan."; exit 1;
}

if [ ! -d "venv" ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv venv
fi
source venv/bin/activate
pip -q install --upgrade pip >/dev/null 2>&1

# ---- Create seeds/ & pilot token generator ----
mkdir -p seeds scripts

cat > scripts/create_pilot_tenant.py <<'PY'
#!/usr/bin/env python3
import os, uuid, json, time, base64, hmac, hashlib
from datetime import datetime

TENANT_ID = os.getenv("PILOT_TENANT_ID","tenant_pilot_001")
TENANT_NAME = os.getenv("PILOT_TENANT_NAME","Pilot Oy")
ADMIN_EMAIL = os.getenv("PILOT_ADMIN_EMAIL","pilot@example.com")
SECRET = os.getenv("DEV_JWT_SECRET","devsecret123")

seed = {
  "tenant_id": TENANT_ID,
  "tenant_name": TENANT_NAME,
  "admin_email": ADMIN_EMAIL,
  "created_at": datetime.utcnow().isoformat()+"Z",
  "features": ["ocr","vat","reports","billing","gamify","legal"],
  "plan": "pro_trial",
  "trial_days": 30
}
os.makedirs("seeds", exist_ok=True)
with open(f"seeds/{TENANT_ID}.json","w") as f:
    json.dump(seed, f, indent=2)

# Generate dev JWT token
header = base64.urlsafe_b64encode(b'{"alg":"HS256","typ":"JWT"}').rstrip(b"=")
payload = base64.urlsafe_b64encode(json.dumps({
  "sub": ADMIN_EMAIL,
  "tenant_id": TENANT_ID,
  "scope": "admin",
  "exp": int(time.time())+60*60*24*7  # 7 days
}).encode()).rstrip(b"=")
sig = base64.urlsafe_b64encode(
    hmac.new(SECRET.encode(), header+b"."+payload, hashlib.sha256).digest()
).rstrip(b"=")
token = b".".join([header,payload,sig]).decode()

with open(f"seeds/{TENANT_ID}.token","w") as f:
    f.write(token)

print(f"✅ Seed created: seeds/{TENANT_ID}.json")
print(f"🔑 Dev token saved: seeds/{TENANT_ID}.token")
PY

chmod +x scripts/create_pilot_tenant.py

# ---- Run tenant creation ----
echo "📝 Generating tenant seed and dev token..."
PILOT_TENANT_ID="$PILOT_TENANT_ID" \
PILOT_TENANT_NAME="$PILOT_TENANT_NAME" \
PILOT_ADMIN_EMAIL="$PILOT_ADMIN_EMAIL" \
DEV_JWT_SECRET="$DEV_JWT_SECRET" \
python3 scripts/create_pilot_tenant.py

DEV_TOKEN_FILE="seeds/${PILOT_TENANT_ID}.token"
DEV_TOKEN="$(cat "$DEV_TOKEN_FILE")"

# ---- Print customer-ready links ----
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📧 SEND TO CUSTOMER: $PILOT_ADMIN_EMAIL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Subject: Tervetuloa Converto Business OS -pilottiin! 🎉"
echo ""
echo "Hei!"
echo ""
echo "Olet mukana Converto Business OS -pilotissa!"
echo ""
echo "🚀 Aloita tästä:"
echo "${FRONTEND_URL}/dashboard?tenant=${PILOT_TENANT_ID}"
echo ""
echo "📱 Pääominaisuudet:"
echo "- 🧾 Kuittiskannaus: ${FRONTEND_URL}/selko/ocr?tenant=${PILOT_TENANT_ID}"
echo "- 🧮 ALV-laskuri (automaattinen)"
echo "- 📊 Raportit (PDF/CSV)"
echo "- ⚖️ Lakitietokanta (Finlex)"
echo "- 💳 Laskutus: ${FRONTEND_URL}/billing?tenant=${PILOT_TENANT_ID}"
echo ""
echo "💡 Pikanäppäimet:"
echo "- Shift+O = Avaa kuittiskannaus"
echo "- Shift+S = Viimeisin kuitti"
echo ""
echo "🆘 Tuki: tuki@converto.fi"
echo ""
echo "Pilotti on ilmainen 30 päivää."
echo ""
echo "Terveisin,"
echo "Converto Team"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 PILOT LINKS (for testing):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Dashboard:      ${FRONTEND_URL}/dashboard?tenant=${PILOT_TENANT_ID}"
echo "OCR (start):    ${FRONTEND_URL}/selko/ocr?tenant=${PILOT_TENANT_ID}"
echo "Billing:        ${FRONTEND_URL}/billing?tenant=${PILOT_TENANT_ID}"
echo ""
echo "🔧 BACKEND HEALTH CHECKS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Health:         ${BACKEND_URL}/health"
echo "Impact summary: ${BACKEND_URL}/api/v1/impact/summary?tenant=${PILOT_TENANT_ID}"
echo "VAT rates:      ${BACKEND_URL}/api/v1/vat/rates"
echo "Legal rules:    ${BACKEND_URL}/api/v1/legal/rules"
echo ""
echo "🔑 DEV TOKEN (pilot testing only):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "File: ${DEV_TOKEN_FILE}"
echo "Usage: Authorization: Bearer <token>"
echo ""
echo "${DEV_TOKEN}"
echo ""
echo "💳 STRIPE PRICES (configure in Render env):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "LITE:     ${STRIPE_PRICE_LITE}"
echo "PRO:      ${STRIPE_PRICE_PRO}"
echo "INSIGHTS: ${STRIPE_PRICE_INSIGHTS}"
echo ""
echo "✅ Pilot setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Send email above to $PILOT_ADMIN_EMAIL"
echo "2. Test OCR: Upload a receipt to ${FRONTEND_URL}/selko/ocr?tenant=${PILOT_TENANT_ID}"
echo "3. Monitor usage: ${FRONTEND_URL}/admin/economy"
echo "4. Schedule feedback call (Week 1)"
echo "5. Track metrics in PILOT_CHECKLIST.md"
echo ""

