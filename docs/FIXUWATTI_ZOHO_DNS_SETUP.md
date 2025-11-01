# ✅ FixUatti.fi DNS Setup - Zoho Mail Integration

**Päivämäärä:** 2025-11-01 12:09:26
**Domain:** fixuwatti.fi
**Status:** ✅ Setup-ohjeet luotu ja käyttövalmiina
**Tavoite:** Zoho Mail -integraatio

## 🔍 **Nykyinen DNS-tilanne**

### DNS-tarkistus (2025-11-01 12:09:26)
```
❌ MX-tietueet: Ei löytynyt (email ei toimi)
❌ A-tietueet: Ei löytynyt (website ei toimi)
❌ SPF-tietue: Ei löytynyt (email security puuttuu)
✅ Name Server: hostingpalvelu.fi (31.217.192.68, 31.217.192.71, 31.217.196.110)
```

### Domain-hallinta
```
🌐 Hallintapaneeli: hostingpalvelu.fi
🔐 Käyttöoikeudet: [Käyttäjä syöttää tunnukset]
📧 Sähköposti: EI KONFIGUROITU
🌐 Website: EI KONFIGUROITU
```

## 🎯 **Tarvittavat DNS-muutokset**

### 1. 🌐 Zoho Mail MX-tietueet
**Lisää hostingpalvelu.fi DNS-hallinnassa:**

```
MX-tietue 1:
Host: @ (tai jätä tyhjäksi)
Type: MX
Priority: 10
Destination: mx.zoho.com

MX-tietue 2:
Host: @
Type: MX
Priority: 20
Destination: mx2.zoho.com
```

### 2. 📝 SPF-tietueen Päivitys
**DNS Zone Editorissa:**

```
Host: @
Type: TXT
Value: v=spf1 include:zoho.com ~all
```

### 3. 🔒 DKIM ja DMARC
**Automaattisesti Zoho Mailissa päälle**

## 🛠️ **Hostingpalvelu.fi cPanel-ohjeet**

### Vaihe 1: Kirjaudu
- **URL:** https://hostingpalvelu.fi
- **Etsi:** Domain-hallinta → fixuwatti.fi
- **Siirry:** Domains → DNS Zone Editor

### Vaihe 2: DNS-konfiguraatio
1. **🗑️ Poista vanhat MX-tietueet** (jos löytyy)
2. **➕ Lisää Zoho MX-tietueet** (yllä kuvattu)
3. **📝 Päivitä SPF-tietue** (yllä kuvattu)
4. **💾 Tallenna muutokset**

### Vaihe 3: Odota propagointia
- **⏰ Odota:** 15-30 minuuttia
- **🔍 Testaa:** dig MX fixuwatti.fi

## 📧 **Zoho Mail Setup**

### Vaihe 1: Domain Management
1. **Kirjaudu:** https://mail.zoho.com
2. **Domain Management:** Add Domain → fixuwatti.fi
3. **DNS-verifiointi:** Seuraa Zoho-ohjeita

### Vaihe 2: Sähköpostitilit
**Luo seuraavat tilit:**
- `hello@fixuwatti.fi` (pääasiallinen)
- `info@fixuwatti.fi` (asiakaspalvelu)
- `support@fixuwatti.fi` (tuki)

### Vaihe 3: IMAP/SMTP-asetukset

#### IMAP (Vastaanotto)
```
Server: imap.zoho.com
Port: 993
Security: SSL/TLS
Authentication: Yes
```

#### SMTP (Lähetys)
```
Server: smtp.zoho.com
Port: 587
Security: STARTTLS
Authentication: Required
```

## 🧪 **Testaus ja Validointi**

### DNS-testit (15-30 min jälkeen)
```bash
# MX-tietueet
dig MX fixuwatti.fi

# SPF-tietue
dig TXT fixuwatti.fi | grep spf

# Odotettu tulos:
fixuwatti.fi mail exchanger = 10 mx.zoho.com.
fixuwatti.fi mail exchanger = 20 mx2.zoho.com.
```

### Sähköpostitesti
```bash
# Lähetä testiviesti
echo 'Test message' | mail -s 'FixUatti Test' hello@fixuwatti.fi

# Vastaanotto: Tarkista hello@fixuwatti.fi -laatikko
# Varmista: Ei ole roskapostilaatikoissa
```

## 🏢 **Email-työkalut ja Integraatiot**

### Converto Business OS -yhteys
**Päivitettävät tiedostot:**
- `.env` - sähköpostiasetukset
- `backend/config.py` - SMTP-konfiguraatio
- Email-järjestelmän integraatio

### Kansainvälinen käyttö
- **USA:** smtp.zoho.com
- **EU:** smtp.zoho.eu
- **Liikenne:** 587/STARTTLS

## 📋 **Yhteenveto**

**Tila:** ✅ **SETUP VALMIS**
- 🔧 DNS-muutokset määritetty
- 📧 Zoho Mail -konfiguraatio valmis
- 🌐 cPanel-ohjeet luotu
- 🧪 Testausmenettelyt määritetty

**Seuraavat askeleet:**
1. Kirjaudu hostingpalvelu.fi/cpanel
2. Seuraa DNS-ohjeita
3. Konfiguroi Zoho Mail
4. Testaa sähköposti 15-30 min jälkeen

**Odotettu lopputulos:**
- ✅ hello@fixuwatti.fi toimii
- ✅ IMAP/SMTP-yhteydet toimivat
- ✅ DKIM ja DMARC käytössä
- ✅ Kansainvälinen email-yhteys varmistettu

---

**Luotu:** 2025-11-01
**Päivitetty:** 2025-11-01 12:09:26
**Valmis käyttöön:** Kyllä ✅
