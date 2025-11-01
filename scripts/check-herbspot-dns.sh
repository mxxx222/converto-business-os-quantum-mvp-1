#!/bin/bash

# Herbspot.fi DNS-tarkistusskripti
# Tarkistaa MX, SPF ja muut DNS-tietueet

echo "🔍 Tarkistetaan herbspot.fi DNS-tietueet..."
echo ""

echo "=== MX-tietueet (Mail Exchange) ==="
MX_RECORDS=$(dig +short MX herbspot.fi)
if [ -z "$MX_RECORDS" ]; then
    echo "❌ MX-tietueet puuttuvat!"
else
    echo "$MX_RECORDS" | while read line; do
        if echo "$line" | grep -q "mx.zoho.com\|mx2.zoho.com"; then
            echo "✅ $line"
        else
            echo "❌ $line (pitäisi olla mx.zoho.com tai mx2.zoho.com)"
        fi
    done
fi

echo ""
echo "=== TXT-tietueet (SPF/DKIM/DMARC) ==="
TXT_RECORDS=$(dig +short TXT herbspot.fi)
if [ -z "$TXT_RECORDS" ]; then
    echo "❌ TXT-tietueet puuttuvat!"
else
    echo "$TXT_RECORDS" | while read line; do
        if echo "$line" | grep -q "spf1"; then
            if echo "$line" | grep -q "zoho.com"; then
                echo "✅ SPF: $line"
            else
                echo "⚠️  SPF: $line (pitäisi sisältää zoho.com)"
            fi
        elif echo "$line" | grep -q "zoho._domainkey"; then
            echo "✅ DKIM: $line"
        elif echo "$line" | grep -q "DMARC"; then
            echo "✅ DMARC: $line"
        else
            echo "ℹ️  $line"
        fi
    done
fi

echo ""
echo "=== A-tietueet ==="
A_RECORDS=$(dig +short A herbspot.fi)
echo "$A_RECORDS"

echo ""
echo "=== Yhteenveto ==="
MX_CHECK=$(dig +short MX herbspot.fi | grep -c "mx.zoho.com\|mx2.zoho.com")
SPF_CHECK=$(dig +short TXT herbspot.fi | grep -c "zoho.com")

if [ "$MX_CHECK" -ge 2 ]; then
    echo "✅ MX-tietueet oikein ($MX_CHECK Zoho MX-tietuetta)"
else
    echo "❌ MX-tietueet puuttuvat tai väärät (löytyi $MX_CHECK Zoho MX-tietuetta)"
fi

if [ "$SPF_CHECK" -ge 1 ]; then
    echo "✅ SPF-tietue sisältää zoho.com"
else
    echo "❌ SPF-tietue puuttuu tai ei sisällä zoho.com"
fi

echo ""
echo "📋 Testaa myös online:"
echo "   - https://mxtoolbox.com/SuperTool.aspx?action=mx%3aherbspot.fi"
echo "   - https://dnschecker.org/#MX/herbspot.fi"

