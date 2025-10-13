# 📱 Converto™ MVP - Aktiiviset Sivut

## ✅ NÄKYVISSÄ MVP:SSÄ (v0.9.0)

### **🏠 Julkiset Sivut (Ei kirjautumista)**

#### **1. Etusivu / Dashboard**
```
URL: /
Route: frontend/app/page.tsx
Sisältö:
  - Hero section (gradient background)
  - Feature cards (6 kpl: OCR, VAT, Quantum Shield, etc.)
  - Stats (247 kuittia, 18h säästetty, etc.)
  - Gamification section (GamifyCard, WalletWidget, RewardsList)
  - CTA section ("Valmis aloittamaan?")
  
Status: ✅ AKTIIVINEN
Näkyvyys: Kaikille
```

#### **2. Dashboard (Alt)**
```
URL: /dashboard
Route: frontend/app/dashboard/page.tsx
Sisältö:
  - UnifiedHeader (StatusChips + QuickReplies)
  - Hero section
  - Feature cards
  - Gamification
  
Status: ✅ AKTIIVINEN
Näkyvyys: Kaikille
Huom: Sama kuin etusivu, mutta eri reitti
```

---

### **📸 Core Features (Pääominaisuudet)**

#### **3. OCR - Kuittiskannaus**
```
URL: /selko/ocr
Route: frontend/app/selko/ocr/page.tsx
Sisältö:
  - Hero (gradient header)
  - Hotkeys (Shift+O, Shift+S, Shift+R)
  - OCR Dropzone (vedä & pudota kuva)
  - OCR Preview (tulokset)
  - OCR Recent (viimeisimmät skannaukset)
  
Status: ✅ AKTIIVINEN
Näkyvyys: Kaikille
Toiminnot:
  - Lataa kuva
  - AI-ekstraktointi (Vision Adapter)
  - Näytä tulokset (vendor, date, total, VAT)
  - Tallenna tietokantaan
```

#### **4. VAT - ALV-laskuri**
```
URL: /vat
Route: frontend/app/vat/page.tsx
Sisältö:
  - UnifiedHeader
  - Gradient header (purple → pink)
  - Calculator icon
  - Month selector
  - VAT breakdown table (24%, 14%, 10%)
  - Total VAT payable
  - Export buttons (CSV, PDF)
  
Status: ✅ AKTIIVINEN
Näkyvyys: Kaikille
Toiminnot:
  - Valitse kuukausi
  - Näytä ALV-yhteenveto
  - Lataa CSV/PDF
```

---

### **💳 Laskutus & Tilaukset**

#### **5. Billing - Hinnoittelu & Tilaus**
```
URL: /billing
Route: frontend/app/billing/page.tsx
Sisältö:
  - UnifiedHeader
  - Pricing cards (3 kpl: Lite €29, Pro €99, Insights €199)
  - Current plan indicator
  - Billing history table
  - Checkout button → Stripe
  
Status: ✅ AKTIIVINEN
Näkyvyys: Kaikille
Toiminnot:
  - Valitse paketti
  - Stripe Checkout
  - Näytä laskuhistoria
  - Lataa PDF-lasku
```

---

### **⚙️ Asetukset & Hallinta**

#### **6. Admin - Support Agent Test**
```
URL: /admin/support
Route: frontend/app/admin/support/page.tsx
Sisältö:
  - Email body textarea
  - "Lähetä testi" button
  - Response preview (intent, confidence)
  
Status: ✅ AKTIIVINEN
Näkyvyys: Admin-käyttäjät
Toiminnot:
  - Testaa Smart Support Agent
  - Näytä AI-luokittelu
```

---

### **🎮 Gamification (Sisällytetty Dashboardiin)**

**Komponentit dashboardissa:**
- `GamifyCard` - Pisteet, streaks, missions
- `WalletWidget` - CT tokens, balance
- `RewardsList` - Palkintokatalogi

**Ei omaa sivua** - integroitu dashboardiin

---

## ❌ EI NÄKYVISSÄ MVP:SSÄ (Tulevaisuutta varten)

### **📦 Valmiina Koodissa, Ei Reititetty:**

#### **POS - Maksupäätteet**
```
URL: /pos (EI AKTIIVINEN)
Route: frontend/app/pos/page.tsx (EXISTS but not routed)
Sisältö: POS provider selector, sales chart, streak
Status: 📦 CODE READY, NOT IN MVP
Aktivointi: Kun 100+ asiakasta tai kysyntää
```

#### **Legal - Lakiseuranta**
```
URL: /legal (EI AKTIIVINEN)
Route: Ei vielä toteutettu
Status: 📋 PLANNED
Aktivointi: Q1 2026
```

#### **Inventory - Varasto**
```
URL: /inventory (EI AKTIIVINEN)
Route: Ei vielä toteutettu
Status: 📋 PLANNED
Aktivointi: Q2 2026
```

#### **Customs - Tullaus**
```
URL: /customs (EI AKTIIVINEN)
Route: Ei vielä toteutettu
Status: 📋 PLANNED
Aktivointi: Q2 2026
```

---

## 🗺️ MVP NAVIGAATIO

### **Päävalikko (Header):**

```
┌─────────────────────────────────────────────────┐
│ Converto Selko    [Etusivu] [Kuitit] [ALV] [Raportit] │
└─────────────────────────────────────────────────┘
```

**Linkit:**
- Etusivu → `/`
- Kuitit → `/selko/ocr`
- ALV → `/vat`
- Raportit → `/reports` (placeholder)

### **Command Palette (⌘K):**

```
Toiminnot:
  📸 Uusi kuitti → /selko/ocr
  🧾 ALV-raportti → /vat
  💾 Varmuuskopio → API call
  
Navigointi:
  📊 Dashboard → /dashboard
  💳 Laskutus → /billing
  ⚙️ Asetukset → /settings (planned)
  
Asetukset:
  🤖 Vaihda OpenAI:hin
  🦙 Vaihda Ollama (local)
```

### **Quick Replies (Mobile):**

```
[📸 Kuitti] [🧾 ALV] [💾 Backup] [⚙️ Asetukset]
```

---

## 📊 SIVUJEN PRIORITEETTI

### **Tier 1 - Kriittiset (MVP Core):**
1. ✅ `/` - Etusivu/Dashboard
2. ✅ `/selko/ocr` - Kuittiskannaus
3. ✅ `/vat` - ALV-laskuri
4. ✅ `/billing` - Hinnoittelu

### **Tier 2 - Tärkeät (MVP+):**
5. ⭕ `/settings` - Asetukset (planned)
6. ⭕ `/reports` - Raportit (placeholder)
7. ⭕ `/auth/login` - Kirjautuminen (magic link)

### **Tier 3 - Tulevaisuus (Post-MVP):**
8. 📦 `/pos` - Maksupäätteet (code ready)
9. 📦 `/legal` - Lakiseuranta (planned)
10. 📦 `/inventory` - Varasto (planned)
11. 📦 `/customs` - Tullaus (planned)

---

## 🎯 MVP USER JOURNEY

### **Ensimmäinen Käyttökerta:**

```
1. Avaa app.converto.fi
   ↓
2. Näkee etusivun (hero + features)
   ↓
3. Klikkaa "Aloita skannaus"
   ↓
4. Siirtyy /selko/ocr
   ↓
5. Lataa kuitti-kuvan
   ↓
6. AI ekstraktoi tiedot
   ↓
7. Näkee tulokset + 👍👎 feedback
   ↓
8. Siirtyy /vat (ALV-yhteenveto)
   ↓
9. Näkee automaattisen laskennan
   ↓
10. Klikkaa /billing (hinnoittelu)
   ↓
11. Valitsee paketin → Stripe Checkout
```

---

## 🧭 NAVIGAATION RAKENNE

```
app.converto.fi/
│
├── / (Etusivu/Dashboard)
│   ├── Hero
│   ├── Features (6 cards)
│   ├── Gamification
│   └── CTA
│
├── /selko/ocr (Kuittiskannaus)
│   ├── Dropzone
│   ├── Preview
│   └── Recent scans
│
├── /vat (ALV-laskuri)
│   ├── Month selector
│   ├── VAT breakdown
│   └── Export (CSV/PDF)
│
├── /billing (Hinnoittelu)
│   ├── Pricing cards (3)
│   ├── Billing history
│   └── Checkout
│
└── /admin/support (Admin only)
    └── Support agent test
```

---

## 🎨 VISUAALINEN HIERARKIA

### **Level 1 - Hero Pages:**
- `/` - Etusivu (gradient hero, features)
- `/dashboard` - Dashboard (sama kuin etusivu)

### **Level 2 - Feature Pages:**
- `/selko/ocr` - OCR (gradient header, dropzone)
- `/vat` - VAT (gradient header, calculator)

### **Level 3 - Utility Pages:**
- `/billing` - Billing (pricing cards)
- `/admin/support` - Admin tools

---

## 🔄 SIVUJEN VÄLINEN LIIKENNE

### **Yleisimmät Polut:**

```
1. / → /selko/ocr (50% käyttäjistä)
2. /selko/ocr → /vat (30%)
3. /vat → /billing (20%)
4. / → /billing (15%)
```

### **Command Palette (⌘K) Käyttö:**

```
- Mistä tahansa → /selko/ocr (quick action)
- Mistä tahansa → /vat (quick action)
- Mistä tahansa → /billing (quick action)
```

---

## 📊 YHTEENVETO

### **MVP Sivut (Aktiiviset):**

| # | Sivu | URL | Status | Prioriteetti |
|---|------|-----|--------|--------------|
| 1 | Etusivu | `/` | ✅ Live | P0 |
| 2 | Dashboard | `/dashboard` | ✅ Live | P0 |
| 3 | OCR | `/selko/ocr` | ✅ Live | P0 |
| 4 | VAT | `/vat` | ✅ Live | P0 |
| 5 | Billing | `/billing` | ✅ Live | P1 |
| 6 | Admin Support | `/admin/support` | ✅ Live | P2 |

**Yhteensä: 6 aktiivista sivua**

### **Tulevaisuus (Ei MVP:ssä):**

| # | Sivu | Status | Timeline |
|---|------|--------|----------|
| 7 | POS | 📦 Code ready | Q2 2026 |
| 8 | Legal | 📋 Planned | Q1 2026 |
| 9 | Inventory | 📋 Planned | Q2 2026 |
| 10 | Customs | 📋 Planned | Q2 2026 |
| 11 | Settings | 📋 Planned | Q4 2025 |
| 12 | Reports | 📋 Planned | Q4 2025 |

---

## 🎯 MVP FOKUS

**Ydin-arvo:**
1. 📸 **Skannaa kuitti** (OCR + AI Vision)
2. 🧾 **Laske ALV** (automaattinen, 25.5%)
3. 💳 **Valitse paketti** (Stripe billing)

**Tukitoiminnot:**
- ⌘K Command Palette (pikavalinnat)
- 🏷️ Status Chips (provider, privacy, latency)
- 📱 Quick Replies (mobile navigation)
- 👍👎 Feedback Buttons (ML learning)

**Ei vielä:**
- ❌ POS-integraatio (valmis, ei näkyvissä)
- ❌ Legal-seuranta (suunniteltu)
- ❌ Varasto/tullaus (suunniteltu)

---

## 🚀 DEPLOYMENT PÄÄTÖS

**MVP sisältää:**
- ✅ 6 sivua (core features)
- ✅ Command Palette (global)
- ✅ Status indicators (all pages)
- ✅ Gamification (dashboard)
- ✅ Billing (Stripe)

**MVP EI sisällä:**
- ❌ POS-sivu (aktivoidaan myöhemmin)
- ❌ Legal-sivu (Q1 2026)
- ❌ Inventory/Customs (Q2 2026)

---

## 📋 NAVIGAATION PÄIVITYS

### **Nykyinen Header (layout.tsx):**

```tsx
<nav className="flex gap-4 text-sm">
  <Link href="/">Etusivu</Link>
  <Link href="/receipts/new">Kuitit</Link>  {/* → /selko/ocr */}
  <Link href="/vat">ALV</Link>
  <Link href="/reports">Raportit</Link>  {/* Placeholder */}
</nav>
```

### **Suositus MVP:lle:**

```tsx
<nav className="flex gap-4 text-sm">
  <Link href="/">Etusivu</Link>
  <Link href="/selko/ocr">Kuitit</Link>
  <Link href="/vat">ALV</Link>
  <Link href="/billing">Hinnoittelu</Link>
</nav>
```

**Muutos:**
- `/receipts/new` → `/selko/ocr` (oikea reitti)
- `/reports` → `/billing` (aktiivinen sivu)

---

## ✅ CLEAN MVP - 6 SIVUA

**Riittää beta-lanseeraukseen:**
- Yksinkertainen
- Fokusissa
- Nopea oppia
- Helppo käyttää

**Laajennukset aktivoidaan:**
- Kun asiakkaat pyytävät
- Kun validoitu
- Kun resurssit riittävät

---

**🎯 MVP = FOCUSED & EFFECTIVE!**

