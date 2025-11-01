# 🟢 Vercel Support Ticket - Account Unlock Request

## 📋 Tilanne
- **Ongelma:** Tili lukittui vahingossa Vercel Agent $100 creditin aktivointiin jälkeen
- **Status:** Tili lukittu/frozen
- **Pyyntö:** Tilin vapautus + Agent-krediitin mitätöinti

---

## ✉️ **Vaihe 1: Sähköposti Vercel Supportille**

### **To:** support@vercel.com
### **Otsikko:** Account locked after accidental Vercel Agent $100 credit activation

### **Viesti (kopioi tämä):**

```
Hei Vercel Support,

Tilini max@herbspot.fi / organisaatio Converto lukittui pian sen jälkeen, kun aktivoin vahingossa "Vercel Agent $100 creditin". En ottanut Agent-palvelua käyttöön enkä kuluttanut krediittejä. Pyydän:

1) Tilin vapauttamista

2) Agent-krediitin mitätöintiä ja mahdollisten automaattisten veloitusten perumista

Liitteenä kuvakaappaus lukituksesta (jos saatavilla). Tarvittaessa voin vahvistaa henkilöllisyyden ja laskutustiedot.

Kiitos ja ystävällisin terveisin,

Max
Converto Business OS
```

---

## 🌐 **Vaihe 2: Vaihtoehtoinen reitti - Vercel Dashboard**

Jos pääset kirjautumaan sisään:

1. **Mene:** https://vercel.com/login
2. **Kirjaudu:** max@herbspot.fi
3. **Klikkaa:** Help → Contact Support
4. **Valitse:** "Account Issue" tai "Billing Issue"
5. **Kopioi** yllä oleva viesti

---

## 📝 **Vaihe 3: Lisätiedot (jos pyydetään)**

### **Henkilöllisyyden vahvistus:**
- **Email:** max@herbspot.fi
- **Organisaatio:** Converto
- **Domainit:** converto.fi, www.converto.fi
- **GitHub:** mxxx222/converto-business-os-mvp

### **Laskutustiedot (jos pyydetään):**
- Kortin 4 viimeistä numeroa: [Täydennä]
- Laskutusosoite: [Täydennä]

---

## ✅ **Vaihe 4: Kun tili on auki**

### **Tarkista ja poista Agent-ominaisuudet:**

1. **Mene:** Settings → Features
2. **Poista käytöstä:**
   - ✅ Vercel AI/Agent → OFF
   - ✅ Tarkista että kaikki AI/Agent -featuret ovat pois päältä

3. **Tarkista Billing:**
   - Mene: Settings → Billing
   - Varmista: Ei avoimia laskuja
   - Tarkista: Ei Agent-krediittejä aktiivisena

---

## ⏱️ **Aikataulu**

- **Tiketin tekeminen:** 10-15 min
- **Vastaus:** 4-48h arkipäivinä
- **Hyöty:** Tili auki, vältyt lisälukituksilta/veloitetuilta

---

## 🚨 **Hätätoimet jos vastaus viivästyy (24-48h)**

### **DNS Fallback:**
Jos tarvitset domainin käyttöön nopeasti:

1. **Cloudflare Pages / Netlify / S3+CloudFront:**
   - Siirrä domain väliaikaisesti staattiseen huoltosivuun
   - Pidä GitHub Actionsissa "pages/static maintenance" -workflow

2. **Build Pipeline:**
   - Älä poista Vercel-integraatioita vielä
   - Paussaa deploymentit

---

## 🔒 **Ennaltaehkäisy jatkossa**

1. **Älä aktivoi promoja/featurejä tuotanto-organisaatiossa**
   - Tee erillinen "Sandbox"-org testeille

2. **Ota Protected Environments käyttöön**
   - Lukitse Feature Flags niin, ettei kokeellisia palveluja voi aktivoida vahingossa prodissa

3. **Pidä Billing-hälytys:**
   - Kuukausibudjetti + email-alertit ylityksistä

---

## 📞 **Yhteystiedot**

- **Vercel Support:** support@vercel.com
- **Vaihtoehtoinen reitti:** https://vercel.com/help → Log in to chat
- **Community:** https://community.vercel.com

---

**Päivitetty:** 2025-11-01
**Status:** 📋 Odottaa tiketin lähettämistä

