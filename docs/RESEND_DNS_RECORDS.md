# 📧 Resend DNS-tietueet converto.fi:lle

**Domain:** converto.fi  
**Status:** Not started (DNS-tietueet lisättävä)  
**Region:** eu-west-1 (Ireland)

---

## DNS-tietueet lisättävä Hostingpalvelu.fi:hin

### **1. Domain Verification (DKIM)**

**TXT-tietue:**
- **Nimi:** `resend._domainkey`
- **Sisältö:** `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDcfm95IULfHReEbyhuttYzpoUb6VhF0b9yLc0HAsDfkTDJ2ofZxuwLMzuUlqTKzb9bQ1ZR+C5BywccSPjMZKlIIxIzB3ZhoEP77Coj1H9Csaysu7yoWr9pxZBw5uL4UBq6DYaJiQYGV6WuEUE8B3kzCovsbGVSaIMjMSuWPq6BZwIDAQAB`
- **TTL:** Auto

---

### **2. Sending Records**

#### **MX-tietue:**
- **Nimi:** `send`
- **Sisältö:** `feedback-smtp.eu-west-1.amazonses.com`
- **Priority:** 10
- **TTL:** Auto

#### **SPF-tietue (TXT):**
- **Nimi:** `send`
- **Sisältö:** `v=spf1 include:amazonses.com ~all`
- **TTL:** Auto

#### **DMARC-tietue (TXT, Optional):**
- **Nimi:** `_dmarc`
- **Sisältö:** `v=DMARC1; p=none;`
- **TTL:** Auto

---

## Toimenpideohje

1. **Kirjaudu Hostingpalvelu.fi:hin**
2. **Avaa DNS Zone Editor** converto.fi:lle
3. **Lisää yllä olevat DNS-tietueet**
4. **Odota 15 min - 24h**
5. **Palaa Resend Dashboardiin** ja klikkaa "Verify DNS Records"

---

## Vahvistus

Kun kaikki DNS-tietueet on lisätty:
- Status muuttuu: `not started` → `verified`
- Voit käyttää `info@converto.fi`, `hello@converto.fi` jne.

