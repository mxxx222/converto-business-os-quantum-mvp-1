#!/bin/bash

# FixUatti DNS Setup Script - Route to Zoho Mail
# This script fixes DNS records for fixuwatti.fi to use Zoho Mail

echo "🔧 FixUatti.fi DNS-korjaus - Zoho Mail-integraatio"
echo "================================================="

# Configuration
DOMAIN="fixuwatti.fi"
OLD_SERVERS="31.217.192.68, 31.217.192.71, 31.217.196.110"  # hostingpalvelu.fi
ZOHO_MX_SERVERS="mx.zoho.com (Priority: 10)"
ZOHO_MX_BACKUP="mx2.zoho.com (Priority: 20)"

# Function to check current DNS status
check_current_dns() {
    echo "🔍 Tarkistetaan nykyinen DNS-tilanne..."

    echo "📋 MX-tietueet:"
    MX_RECORD=$(dig MX $DOMAIN +short 2>/dev/null)
    if [ -z "$MX_RECORD" ]; then
        echo "❌ Ei MX-tietueita löytynyt"
    else
        echo "$MX_RECORD"
    fi

    echo ""
    echo "📋 A-tietueet:"
    A_RECORD=$(dig A $DOMAIN +short 2>/dev/null)
    if [ -z "$A_RECORD" ]; then
        echo "❌ Ei A-tietueita löytynyt"
    else
        echo "$A_RECORD"
    fi

    echo ""
    echo "📋 SPF-tietue:"
    SPF_RECORD=$(dig TXT $DOMAIN | grep spf)
    if [ -z "$SPF_RECORD" ]; then
        echo "❌ Ei SPF-tietuetta löytynyt"
    else
        echo "$SPF_RECORD"
    fi
}

# Function to display DNS records that need to be changed
show_required_changes() {
    echo "📝 Tarvittavat MX-tietueen muutokset:"
    echo "==================================="
    echo ""
    echo "🗑️  POISTA nykyiset MX-tietueet (jos olemassa):"
    echo "   • Tarkista ja poista vanhat hostingpalvelu.fi MX-tietueet"
    echo ""
    echo "➕ LISÄÄ Zoho Mail MX-tietueet:"
    echo "   1. Host: @ (tai jätä tyhjäksi)"
    echo "      Type: MX"
    echo "      Priority: 10"
    echo "      Value: mx.zoho.com"
    echo ""
    echo "   2. Host: @"
    echo "      Type: MX"
    echo "      Priority: 20"
    echo "      Value: mx2.zoho.com"
    echo ""
    echo "📋 Päivitä SPF-tietue:"
    echo "   Host: @"
    echo "   Type: TXT"
    echo "   Value: v=spf1 include:zoho.com ~all"
    echo ""
    echo "✅ DKIM ja DMARC asetetaan automaattisesti Zoho Mailissa"
}

# Function to create cPanel instructions for hostingpalvelu.fi
show_cpanel_instructions() {
    echo "🎯 cPanel-ohjeet hostingpalvelu.fi:lle:"
    echo "==================================="
    echo ""
    echo "1. 🌐 Kirjaudu hostingpalvelu.fi:hin"
    echo "   URL: https://hostingpalvelu.fi"
    echo "   • Domain-hallinta: Etsi fixuwatti.fi"
    echo ""
    echo "2. 📧 DNS-hallinta:"
    echo "   • Siirry: Domainit → fixuwatti.fi → DNS-asetukset"
    echo "   • TAI: Domains → DNS Zone Editor → fixuwatti.fi"
    echo ""
    echo "3. 🗑️  Poista vanhat MX-tietueet:"
    echo "   • Etsi MX-tietueet jotka viittasivat vanhaan palveluun"
    echo "   • Poista nämä tietueet"
    echo ""
    echo "4. ➕ Lisää Zoho Mail MX-tietueet:"
    echo "   • Klikkaa: 'Lisää MX-tietue'"
    echo "   • Täytä tiedot alla"
    echo ""
    echo "📋 MX-tietue 1:"
    echo "   Host: @ (tai jätä tyhjäksi)"
    echo "   Type: MX"
    echo "   Priority: 10"
    echo "   Destination: mx.zoho.com"
    echo ""
    echo "📋 MX-tietue 2:"
    echo "   Host: @"
    echo "   Type: MX"
    echo "   Priority: 20"
    echo "   Destination: mx2.zoho.com"
    echo ""
    echo "5. 📝 Päivitä SPF-tietue:"
    echo "   • Etsi TXT-tietue joka sisältää 'v=spf1'"
    echo "   • Korvaa sisältö: 'v=spf1 include:zoho.com ~all'"
    echo ""
    echo "6. 💾 Tallenna kaikki muutokset"
    echo ""
    echo "7. ⏰ Odota 15-30 min propagointia"
}

# Function to test DNS changes
test_dns_changes() {
    echo "🧪 DNS-testauksen jälkeen (15-30 min odotuksen jälkeen):"
    echo "==============================================="
    echo ""
    echo "🔍 Tarkista MX-tietueet:"
    echo "dig MX $DOMAIN"
    echo ""
    echo "🔍 Tarkista SPF-tietue:"
    echo "dig TXT $DOMAIN | grep spf"
    echo ""
    echo "🔍 Testaa email-lähetys:"
    echo "echo 'Test message' | mail -s 'FixUatti Test' hello@$DOMAIN"
    echo ""
    echo "📧 Odotettu tulos MX-tietueille:"
    echo "$DOMAIN mail exchanger = 10 mx.zoho.com."
    echo "$DOMAIN mail exchanger = 20 mx2.zoho.com."
}

# Function to create Zoho Mail setup guide
create_zoho_setup_guide() {
    echo "📧 Zoho Mail Setup Guide:"
    echo "========================="
    echo ""
    echo "1. 🎯 Kirjaudu Zoho Mailiin:"
    echo "   URL: https://mail.zoho.com"
    echo "   • Luo tili tai kirjaudu olemassa olevalla tilillä"
    echo ""
    echo "2. 🏢 Domain-verifiointi:"
    echo "   • Siirry: Domain Management → Add Domain"
    echo "   • Lisää domain: $DOMAIN"
    echo ""
    echo "3. 🔐 DNS-verifiointi:"
    echo "   • Zoho tarvitsee DNS-verifikaation"
    echo "   • Seuraa Zoho Mailin ohjeita DNS-muutosten jälkeen"
    echo ""
    echo "4. 📧 Luo sähköpostitilit:"
    echo "   • hello@$DOMAIN"
    echo "   • info@$DOMAIN"
    echo "   • support@$DOMAIN"
    echo ""
    echo "5. ⚙️  Aseta IMAP/SMTP:"
    echo "   IMAP (Vastaanotto):"
    echo "   Server: imap.zoho.com"
    echo "   Port: 993"
    echo "   Security: SSL/TLS"
    echo ""
    echo "   SMTP (Lähetys):"
    echo "   Server: smtp.zoho.com"
    echo "   Port: 587"
    echo "   Security: STARTTLS"
    echo ""
    echo "6. 🔒 Ota käyttöön lisäominaisuudet:"
    echo "   • DKIM (automaattinen)"
    echo "   • DMARC (suositeltu)"
    echo "   • SSL-sertifikaatit"
}

# Function to generate email templates
generate_email_templates() {
    echo "📧 Email-mallit testaukseen:"
    echo "=========================="
    echo ""
    echo "🔧 Test-viestit:"
    echo "-------------"
    echo "Kohde: hello@$DOMAIN"
    echo "Aihe: FixUatti.fi DNS Test"
    echo "Sisältö:"
    echo "Tämä on testiviesti varmistaakseni että sähköposti"
    echo "toimii oikein FixUatti.fi -domainin kanssa."
    echo ""
    echo "-------------\n"
    echo "📋 Seuraa sähköpostin lähetys- ja vastaanottovirheitä"
    echo "📧 Testaa myös liitteet ja suuret viestit"
    echo "🔍 Tarkista roskapostilaatikko"
}

# Main execution
main() {
    echo "🚀 FixUatti.fi DNS-korjaus aloitettu"
    echo "Domain: $DOMAIN"
    echo "Tavoite: Zoho Mail -integraatio"
    echo ""

    # Check current DNS
    check_current_dns
    echo ""

    # Show required changes
    show_required_changes
    echo ""

    # Show cPanel instructions
    show_cpanel_instructions
    echo ""

    # Show Zoho setup guide
    create_zoho_setup_guide
    echo ""

    # Show testing procedures
    test_dns_changes
    echo ""

    # Show email templates
    generate_email_templates

    echo ""
    echo "💡 Muistutukset:"
    echo "================"
    echo "• Ota yhteys hostingpalvelu.fi tukeen jos tarvitset apua"
    echo "• Varmista että kaikki tietueet on tallennettu"
    echo "• Testaa sähköposti huolellisesti muutosten jälkeen"
    echo "• Ota varmuuskopio nykyisistä asetuksista ennen muutoksia"
    echo ""
    echo "✅ Setup-valmis! Seuraa ohjeita ylhäältä."
}

# Run main function
main
