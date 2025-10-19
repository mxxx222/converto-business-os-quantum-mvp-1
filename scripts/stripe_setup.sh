#!/bin/bash
# Stripe Products & Prices Setup for Converto 2.0

echo "🔷 STRIPE SETUP - CONVERTO 2.0"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI ei ole asennettu!"
    echo "Asenna: https://stripe.com/docs/stripe-cli"
    exit 1
fi

echo "✅ Stripe CLI löydetty"
echo ""

# Login check
echo "🔐 Kirjaudu Stripeen..."
stripe login

echo ""
echo "📦 LUODAAN TUOTTEET..."
echo ""

# Create Products
echo "1️⃣ FixuWatti FW-600..."
FW600=$(stripe products create \
  --name "FixuWatti FW-600" \
  --description "600Wh kannettava virtalaite - Suomen suunniteltu" \
  --metadata sku=FW-600 \
  --metadata watt_hours=600 \
  --metadata paas=false \
  --format json | jq -r '.id')
echo "   Product ID: $FW600"

echo ""
echo "2️⃣ FixuWatti FW-1100..."
FW1100=$(stripe products create \
  --name "FixuWatti FW-1100" \
  --description "1100Wh kannettava virtalaite - Premium-malli" \
  --metadata sku=FW-1100 \
  --metadata watt_hours=1100 \
  --metadata paas=false \
  --format json | jq -r '.id')
echo "   Product ID: $FW1100"

echo ""
echo "3️⃣ FixuWatti PaaS Monthly..."
PAAS=$(stripe products create \
  --name "FixuWatti PaaS Monthly" \
  --description "Platform as a Service - Kuukausitilaus" \
  --metadata sku=FW-PAAS-MONTHLY \
  --metadata paas=true \
  --metadata interval=month \
  --format json | jq -r '.id')
echo "   Product ID: $PAAS"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💰 LUODAAN HINNAT (ALV sisältyy)..."
echo ""

# Create Prices (inclusive VAT)
echo "1️⃣ FW-600: 549,00€ (sis. ALV)"
PRICE_FW600=$(stripe prices create \
  --unit-amount 54900 \
  --currency eur \
  --product "$FW600" \
  --tax-behavior inclusive \
  --format json | jq -r '.id')
echo "   Price ID: $PRICE_FW600"

echo ""
echo "2️⃣ FW-1100: 899,00€ (sis. ALV)"
PRICE_FW1100=$(stripe prices create \
  --unit-amount 89900 \
  --currency eur \
  --product "$FW1100" \
  --tax-behavior inclusive \
  --format json | jq -r '.id')
echo "   Price ID: $PRICE_FW1100"

echo ""
echo "3️⃣ PaaS: 59,90€/kk (sis. ALV)"
PRICE_PAAS=$(stripe prices create \
  --unit-amount 5990 \
  --currency eur \
  --product "$PAAS" \
  --tax-behavior inclusive \
  --recurring[interval]=month \
  --format json | jq -r '.id')
echo "   Price ID: $PRICE_PAAS"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ VALMIS!"
echo ""
echo "📝 KOPIOI NÄMÄ .env-TIEDOSTOON:"
echo ""
echo "# Stripe Products"
echo "STRIPE_PRODUCT_FW600=$FW600"
echo "STRIPE_PRODUCT_FW1100=$FW1100"
echo "STRIPE_PRODUCT_PAAS=$PAAS"
echo ""
echo "# Stripe Prices"
echo "STRIPE_PRICE_FW600_ONE=$PRICE_FW600"
echo "STRIPE_PRICE_FW1100_ONE=$PRICE_FW1100"
echo "STRIPE_PRICE_PAAS_MONTHLY=$PRICE_PAAS"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 SEURAAVAKSI:"
echo "  1. Kopioi yllä olevat rivit .env-tiedostoon"
echo "  2. Lisää STRIPE_SECRET_KEY ja STRIPE_WEBHOOK_SECRET"
echo "  3. Käynnistä webhook: stripe listen --forward-to localhost:8010/api/v1/stripe/webhook"
echo ""
