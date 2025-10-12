#!/bin/bash
# Pilot Customer Setup Script
# Usage: ./scripts/pilot_setup.sh "Company Name" "email@company.com"

set -e

if [ $# -lt 2 ]; then
    echo "Usage: $0 'Company Name' 'email@company.com'"
    exit 1
fi

COMPANY_NAME="$1"
EMAIL="$2"
TENANT_ID="tenant_$(echo $COMPANY_NAME | tr '[:upper:]' '[:lower:]' | tr ' ' '_')"
USER_ID="user_$(echo $EMAIL | cut -d'@' -f1)"

echo "🚀 Setting up pilot customer..."
echo ""
echo "Company: $COMPANY_NAME"
echo "Email: $EMAIL"
echo "Tenant ID: $TENANT_ID"
echo "User ID: $USER_ID"
echo ""

# Create seeds directory
mkdir -p seeds

# Generate tenant seed
cat > "seeds/${TENANT_ID}.json" <<EOF
{
  "tenant_id": "$TENANT_ID",
  "tenant_name": "$COMPANY_NAME",
  "admin_email": "$EMAIL",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "features": ["ocr", "vat", "reports", "billing", "gamify", "legal"],
  "plan": "pro_trial",
  "trial_ends": "$(date -u -v+30d +%Y-%m-%d)"
}
EOF

echo "✅ Tenant seed created: seeds/${TENANT_ID}.json"

# Generate access links
FRONTEND_URL="${FRONTEND_URL:-https://converto-frontend.onrender.com}"

echo ""
echo "📧 SEND TO CUSTOMER:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Subject: Tervetuloa Converto Business OS -pilottiin! 🎉"
echo ""
echo "Hei!"
echo ""
echo "Olet mukana Converto Business OS -pilotissa!"
echo ""
echo "🚀 Aloita tästä:"
echo "$FRONTEND_URL"
echo ""
echo "📱 Pääominaisuudet:"
echo "- 🧾 Kuittiskannaus (OCR AI)"
echo "- 🧮 ALV-laskuri (automaattinen)"
echo "- 📊 Raportit (PDF/CSV)"
echo "- ⚖️ Lakitietokanta (Finlex)"
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
echo "✅ Pilot setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Send email above to $EMAIL"
echo "2. Monitor usage: $FRONTEND_URL/admin/economy"
echo "3. Schedule feedback call (Week 1)"
echo "4. Track metrics in PILOT_CHECKLIST.md"
echo ""

