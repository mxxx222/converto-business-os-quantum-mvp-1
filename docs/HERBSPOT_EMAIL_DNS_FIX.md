# 🔧 Herbspot Email DNS -korjausohje

## 🎯 Ongelma
- **Domain:** herbspot.fi
- **Email:** max@herbspot.fi
- **Email-palvelu:** Zoho Mail
- **Ongelma:** Emailit eivät kulje Zoho Mailiin

---

## 📋 **Vaihe 1: Kirjaudu Hostingpalvelu.fi:hin**

1. **Mene:** https://www.hostingpalvelu.fi/asiakkaat/index.php?rp=/login
2. **Kirjaudu:** Käytä asiakastilin tunnuksia
3. **Valitse:** Domainit → herbspot.fi

---

## 🔍 **Vaihe 2: Tarkista DNS-asetukset**

### **A) MX-tietueet (Mail Exchange) - KRITISKI**

**Oikeat MX-tietueet Zoho Mailille:**
```
MX 10 mx.zoho.com
MX 20 mx2.zoho.com
MX 50 mx3.zoho.com
```

**Tarkista:**
- ✅ Onko MX-tietueet oikein?
- ✅ Ovatko ne aktiiviset?
- ✅ Onko prioriteetit oikein (10, 20, 50)?

**Jos puuttuu tai väärin:**
1. Poista vanhat MX-tietueet
2. Lisää uudet MX-tietueet:
   - **Host:** @ (tai herbspot.fi)
   - **Type:** MX
   - **Priority:** 10
   - **Value:** mx.zoho.com

---

### **B) TXT-tietueet (SPF/DKIM/DMARC)**

**SPF-tietue (Sender Policy Framework):**
```
TXT @ "v=spf1 include:zoho.com ~all"
```

**DKIM-tietue (Zoho Mail):**
- Hae Zoho Mail -asetuksista
- Yleensä muotoa: `zoho._domainkey` → TXT-tietue

**DMARC-tietue:**
```
TXT _dmarc "v=DMARC1; p=none; rua=mailto:max@herbspot.fi"
```

**Tarkista:**
- ✅ Onko SPF-tietue olemassa?
- ✅ Onko DKIM-tietue lisätty?
- ✅ Onko DMARC-tietue lisätty?

---

### **C) CNAME-tietueet (Zoho Mail)**

**Tarkista:**
- ✅ `mail.zoho.com` → CNAME (jos käytössä)
- ✅ Onko kaikki Zoho-vaaditut CNAME-tietueet lisätty?

---

## 📧 **Vaihe 3: Tarkista Zoho Mail -asetukset**

### **A) Kirjaudu Zoho Mailiin**

1. **Mene:** https://mail.zoho.com
2. **Kirjaudu:** max@herbspot.fi
3. **Mene:** Settings → Domains → herbspot.fi

### **B) Tarkista domain-verifiointi**

**Zoho Mail -asetuksissa:**
- ✅ Onko domain verified?
- ✅ Näkyvätkö DNS-tietueet oikein?
- ✅ Onko DNS-propagation valmis?

**Jos domain ei ole verified:**
1. Zoho näyttää vaaditut DNS-tietueet
2. Kopioi ne ja lisää Hostingpalvelu.fi:hin
3. Odota DNS-propagation (2-48h)
4. Verifioi Zoho Mailissa

---

## 🛠️ **Vaihe 4: Korjausohjeet**

### **Jos MX-tietueet puuttuvat:**

1. **Hostingpalvelu.fi → Domainit → herbspot.fi → DNS**
2. **Lisää MX-tietue:**
   - **Host:** @
   - **Type:** MX
   - **Priority:** 10
   - **Value:** mx.zoho.com
3. **Lisää toinen MX-tietue:**
   - **Host:** @
   - **Type:** MX
   - **Priority:** 20
   - **Value:** mx2.zoho.com
4. **Tallenna ja odota 15-30 min**

---

### **Jos SPF/DKIM puuttuu:**

1. **Lisää SPF-tietue:**
   - **Host:** @
   - **Type:** TXT
   - **Value:** `v=spf1 include:zoho.com ~all`

2. **Lisää DKIM-tietue (Zoho Mailista):**
   - Hae Zoho Mail → Settings → Domains → DKIM Settings
   - Kopioi TXT-tietue ja lisää Hostingpalvelu.fi:hin

---

## 🔍 **Vaihe 5: Testaa DNS**

### **A) Tarkista MX-tietueet:**

```bash
# Komentorivillä:
dig MX herbspot.fi
# Tai:
nslookup -type=MX herbspot.fi
```

**Tuloksen pitäisi näyttää:**
```
herbspot.fi mail exchanger = 10 mx.zoho.com.
herbspot.fi mail exchanger = 20 mx2.zoho.com.
```

### **B) Tarkista SPF:**

```bash
dig TXT herbspot.fi | grep spf
```

**Tuloksen pitäisi sisältää:** `v=spf1 include:zoho.com ~all`

### **C) Online-työkalut:**

- **MX Check:** https://mxtoolbox.com/SuperTool.aspx?action=mx%3aherbspot.fi
- **DNS Check:** https://dnschecker.org/#MX/herbspot.fi
- **SPF Check:** https://mxtoolbox.com/spf.aspx

---

## ⚠️ **Yleisimmät ongelmat**

### **1. DNS ei ole propagoitunut**
- **Syy:** Muutokset eivät ole vielä levinneet
- **Ratkaisu:** Odota 2-48h ja tarkista uudelleen

### **2. Väärät MX-tietueet**
- **Syy:** Vanhat MX-tietueet (esim. hostingpalvelu.fi:n omat)
- **Ratkaisu:** Poista vanhat, lisää Zoho Mailin MX-tietueet

### **3. SPF-tietue puuttuu**
- **Syy:** SPF-tietue ei ole lisätty
- **Ratkaisu:** Lisää SPF-tietue Zoho Mailille

### **4. DKIM ei ole konfiguroitu**
- **Syy:** DKIM-tietue puuttuu
- **Ratkaisu:** Hae DKIM Zoho Mailista ja lisää DNS:ään

---

## 📞 **Yhteystiedot**

- **Hostingpalvelu.fi tuki:** asiakaspalvelu@hostingpalvelu.fi
- **Puhelin:** +358 (0) 9 42450 284
- **Zoho Mail tuki:** https://help.zoho.com/portal/en/kb/mail

---

## ✅ **Tarkistuslista**

- [ ] Kirjauduttu Hostingpalvelu.fi:hin
- [ ] MX-tietueet lisätty (mx.zoho.com, mx2.zoho.com)
- [ ] SPF-tietue lisätty
- [ ] DKIM-tietue lisätty (Zoho Mailista)
- [ ] DMARC-tietue lisätty (valinnainen)
- [ ] DNS-testit suoritettu (MX, SPF)
- [ ] Zoho Mailissa domain verified
- [ ] Testisähköposti lähetetty ja vastaanotettu

---

**Päivitetty:** 2025-11-01
**Status:** 🔧 Odottaa DNS-korjauksia

