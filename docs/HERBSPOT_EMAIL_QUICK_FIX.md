# 🚨 Herbspot Email - Nopea korjaus

## ❌ **ONGELMA LÖYDETTY:**

**Nykyiset DNS-tietueet:**
- ❌ **MX:** `mailwp23.hostingpalvelu.fi` (VÄÄRÄ - Hostingpalvelu.fi:n oma)
- ✅ **SPF:** Olemassa mutta Hostingpalvelu.fi:n oma
- ❌ **Zoho Mail:** Ei konfiguroitu

**Tulisi olla:**
- ✅ **MX:** `mx.zoho.com` (priority 10)
- ✅ **MX:** `mx2.zoho.com` (priority 20)
- ✅ **SPF:** `v=spf1 include:zoho.com ~all`

---

## 🔧 **KORJAUS - 3 VAIHETTA:**

### **Vaihe 1: Kirjaudu Hostingpalvelu.fi:hin**

1. **Mene:** https://www.hostingpalvelu.fi/asiakkaat/index.php?rp=/login
2. **Kirjaudu sisään**
3. **Valitse:** Domainit → herbspot.fi → DNS-asetukset

---

### **Vaihe 2: Poista vanhat MX-tietueet**

1. **Etsi:** MX-tietueet
2. **Poista:** `mailwp23.hostingpalvelu.fi` (priority 0)
3. **Tallenna**

---

### **Vaihe 3: Lisää Zoho Mailin MX-tietueet**

**Lisää ensimmäinen MX-tietue:**
- **Host:** @ (tai jätä tyhjäksi)
- **Type:** MX
- **Priority:** 10
- **Value:** mx.zoho.com
- **TTL:** 3600 (tai automaattinen)

**Lisää toinen MX-tietue:**
- **Host:** @ (tai jätä tyhjäksi)
- **Type:** MX
- **Priority:** 20
- **Value:** mx2.zoho.com
- **TTL:** 3600 (tai automaattinen)

**Tallenna muutokset**

---

### **Vaihe 4: Päivitä SPF-tietue**

1. **Etsi:** TXT-tietueet
2. **Etsi:** SPF-tietue (alkaa `v=spf1`)
3. **Muuta:** `v=spf1 +a +mx +ip4:31.217.192.197 +ip4:31.217.192.198 ~all`
4. **Uusi arvo:** `v=spf1 include:zoho.com ~all`
5. **Tallenna**

---

### **Vaihe 5: Lisää DKIM (Zoho Mailista)**

1. **Kirjaudu Zoho Mailiin:** https://mail.zoho.com
2. **Mene:** Settings → Domains → herbspot.fi → DKIM Settings
3. **Kopioi DKIM-tietue** (muotoa: `zoho._domainkey`)
4. **Lisää Hostingpalvelu.fi:hin:**
   - **Host:** zoho._domainkey
   - **Type:** TXT
   - **Value:** [Kopioi Zoho Mailista]
   - **Tallenna**

---

## ⏱️ **DNS-Propagation**

- **Odota:** 15-60 min
- **Tarkista:** `dig MX herbspot.fi`
- **Odotettu tulos:**
  ```
  herbspot.fi mail exchanger = 10 mx.zoho.com.
  herbspot.fi mail exchanger = 20 mx2.zoho.com.
  ```

---

## ✅ **Testaus**

1. **Tarkista MX:** `dig MX herbspot.fi`
2. **Tarkista SPF:** `dig TXT herbspot.fi | grep spf`
3. **Lähetä testisähköposti:** Lähetä max@herbspot.fi:lle ulkoisesta osoitteesta
4. **Tarkista Zoho Mail:** Kirjaudu https://mail.zoho.com ja tarkista saapuuko email

---

## 📞 **Jos ei toimi**

- **Hostingpalvelu.fi tuki:** asiakaspalvelu@hostingpalvelu.fi / +358 (0) 9 42450 284
- **Zoho Mail tuki:** https://help.zoho.com/portal/en/kb/mail

---

**Päivitetty:** 2025-11-01
**Status:** 🔧 Odottaa DNS-muutoksia

