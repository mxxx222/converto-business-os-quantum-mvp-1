# ✅ DNS-korjaus valmiina kopioitavaksi

## 📋 **Kopioi nämä DNS-tietueet Hostingpalvelu.fi:hin**

### **1. POISTA VANHAT MX-TIETUEET:**
```
❌ Poista:
- mailwp23.hostingpalvelu.fi (priority 0)
```

---

### **2. LISÄÄ UUDET MX-TIETUEET:**

**MX-tietue 1:**
```
Host: @ (tai jätä tyhjäksi)
Type: MX
Priority: 10
Value: mx.zoho.com
TTL: 3600
```

**MX-tietue 2:**
```
Host: @ (tai jätä tyhjäksi)
Type: MX
Priority: 20
Value: mx2.zoho.com
TTL: 3600
```

---

### **3. PÄIVITÄ SPF-TIETUE:**

**Löydä nykyinen TXT-tietue:**
```
v=spf1 +a +mx +ip4:31.217.192.197 +ip4:31.217.192.198 ~all
```

**Muuta se:**
```
v=spf1 include:zoho.com ~all
```

**Tiedot:**
```
Host: @ (tai jätä tyhjäksi)
Type: TXT
Value: v=spf1 include:zoho.com ~all
TTL: 3600
```

---

### **4. LISÄÄ DKIM-TIETUE (Zoho Mailista):**

**Ensin hae Zoho Mailista:**
1. Kirjaudu: https://mail.zoho.com
2. Settings → Domains → herbspot.fi → DKIM Settings
3. Kopioi DKIM-tietue

**Sitten lisää Hostingpalvelu.fi:hin:**
```
Host: zoho._domainkey
Type: TXT
Value: [Kopioi Zoho Mailista]
TTL: 3600
```

---

## ✅ **Tarkistuslista:**

- [ ] Vanhat MX-tietueet poistettu
- [ ] mx.zoho.com lisätty (priority 10)
- [ ] mx2.zoho.com lisätty (priority 20)
- [ ] SPF-tietue päivitetty
- [ ] DKIM-tietue lisätty (Zoho Mailista)
- [ ] Muutokset tallennettu
- [ ] Odotetaan 15-60 min DNS-propagation
- [ ] Testattu: `dig MX herbspot.fi`

---

**Päivitetty:** 2025-11-01

