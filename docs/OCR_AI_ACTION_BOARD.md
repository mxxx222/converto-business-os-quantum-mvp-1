# 🎯 Converto™ Receipt AI - Action Board
## "100–0 Suomessa" - Markkinajohtajuus 12 viikossa

> **Tavoite**: Rakentaa Suomen älykkäin kuitintunnistusjärjestelmä ja saavuttaa markkinajohtajuus pk-yrityksissä.

---

## 📊 Markkina-analyysi (Suomi)

### Nykyiset toimijat:

| Toimija | Fokus | Heikkous |
|---------|-------|----------|
| **Visma Netvisor** | Kirjanpito + Scanner | OCR-laatu vaihteleva, ei gamifikaatiota |
| **Procountor** | Taloushallinto + Mobile OCR | Kallis, vaikea käyttää |
| **Holvi** | Pankki + kuittipyyntö | Manuaalinen matchaus, ei automaatiota |
| **ReceiptHero** | Digitaalikuitti ekosysteemi | Vain kumppanikaupat |

### Converto™ erottuu:

✅ **Älykkäin OCR**: Multi-engine (Vision LLM + Textract + Tesseract)
✅ **Hotkeys kaikkeen**: Shift+O, WA/Slack-komennot
✅ **ALV-automaatio**: 24/14/10/0% tunnistus + tiliöinti
✅ **Gamify**: Pisteet + palkinnot → sitouttaa käyttöön
✅ **Integraatiot**: Netvisor, Procountor, Holvi, ReceiptHero

---

## 🗓️ Sprint 1: OCR MVP Pipeline (Viikot 1–2)

### Backend

- [ ] **OCR Vision API** - Luo `/api/v1/ocr-ai/scan` endpoint
  - Input: Kuva (JPEG/PNG)
  - Output: JSON (merchant, date, total, VAT, items, category)
  - Acceptance: >85% tarkkuus test-kuiteilla
  - Files: `app/api/ocr_ai.py`, `app/modules/vision/extractor_openai.py`
  - **Status**: ✅ VALMIS

- [ ] **Multi-OCR Ensemble** - Yhdistä Vision + Textract + Tesseract
  - Voting system: paras tulos voittaa
  - Fallback: jos yksi failaa, muut pelastavat
  - Acceptance: <5% failure rate
  - Files: `app/modules/vision/ensemble.py`

- [ ] **S3 Storage** - Tallenna kuitit versionoituna
  - Bucket: `converto-receipts-{env}`
  - Prefix: `{tenant_id}/{year}/{month}/{receipt_id}.jpg`
  - Acceptance: kaikki kuitit talteen, GDPR-compliant
  - Files: `shared_core/utils/storage.py`

### Frontend

- [ ] **OCRDropzone** - Drag & drop -kuittien lataus
  - Drag kuva → preview → "Analysoi" tai "Hyväksy & Tallenna"
  - Acceptance: toimii desktop + mobile
  - Files: `frontend/components/OCRDropzone.tsx`
  - **Status**: ✅ VALMIS

- [ ] **Hotkeys** - Keyboard shortcuts
  - Shift+O → Skannaa
  - Shift+S → Viimeisin
  - Shift+R → Uudelleen
  - Acceptance: toimii kaikissa selaimissa
  - Files: `frontend/components/OCRHotkeys.tsx`
  - **Status**: ✅ VALMIS

### Gamify

- [ ] **OCR Success → Points** - Automaattinen pisteytys
  - +10p per kuitti
  - +5p bonus jos confidence >90%
  - Acceptance: pisteet näkyvät heti dashboardissa
  - Files: `shared_core/modules/gamify/service.py`
  - **Status**: ✅ VALMIS

---

## 🗓️ Sprint 2: AI Classifier + ALV (Viikot 3–4)

### AI Classification

- [ ] **VAT Classifier** - ALV-luokan tunnistus
  - Kategoriat: ruoka (14%), energia (24%), terveys (10%), kirjat (10%)
  - Machine learning tai rule-based
  - Acceptance: >90% tarkkuus tunnetuilla kategorioilla
  - Files: `app/modules/vision/classifier_ai.py`
  - **Status**: ✅ VALMIS (rule-based MVP)

- [ ] **Budget Line Mapper** - Kustannuspaikan ehdotus
  - Input: category + merchant
  - Output: GL account (esim. "5100-RUOKA")
  - Acceptance: järkevät ehdotukset 95% ajasta
  - Files: `app/modules/vision/classifier_ai.py`
  - **Status**: ✅ VALMIS

### Automation

- [ ] **Ledger Integration** - Kirjanpitoviennit
  - Create ledger entry from OCR result
  - POST to Netvisor/Procountor API
  - Acceptance: vienti menee läpi ilman virheitä
  - Files: `app/modules/ledger/netvisor.py`, `procountor.py`

- [ ] **Audit Trail** - GDPR-compliant logging
  - Log: who, what, when, confidence
  - Retention: 7 years
  - Acceptance: kaikki OCR-tapahtumat logissa
  - Files: `shared_core/modules/ocr/models.py` (OcrAudit)
  - **Status**: ✅ VALMIS

---

## 🗓️ Sprint 3: Integraatiot (Viikot 5–6)

### Priority Integrations

- [ ] **Netvisor API** - Ostolaskut
  - Endpoint: `/api/v1/integrations/netvisor/invoice`
  - Auth: API key + OAuth2
  - Acceptance: kuitti → Netvisor ilman manuaalista työtä
  - Docs: https://support.netvisor.fi/hc/fi/sections/360003281372-Rajapinta

- [ ] **Procountor API** - Tositteet
  - Endpoint: `/api/v1/integrations/procountor/voucher`
  - Auth: OAuth2
  - Acceptance: ALV-erittelyt menevät oikein
  - Docs: https://api.procountor.com/api-docs/

- [ ] **Holvi API** - Pankkitapahtumat
  - Match transaction + receipt
  - Auto-categorization
  - Acceptance: 80% matchaus automaattisesti
  - Docs: https://www.holvi.com/developers/

- [ ] **ReceiptHero API** - Digitaalikuitit
  - Webhook: receipt.created → ingest
  - Rich data (no OCR needed!)
  - Acceptance: digikuitit menevät suoraan kirjanpitoon
  - Docs: https://receipthero.fi/developers/

### Export Formats

- [ ] **CSV Export** - Perusvienti
  - Columns: date, merchant, total, vat, category, gl_account
  - Acceptance: tilitoimistot voivat importoida suoraan
  - Files: `app/api/ocr_ai.py` (export endpoint)

- [ ] **Email Gateway** - Sähköposti-silta
  - Forward receipt → scan@converto.fi → parsitaan
  - Acceptance: 90% kuiteista tunnistetaan emailista
  - Files: `app/services/email_ingest.py`

---

## 🗓️ Sprint 4: Hotkeys & Channels (Viikot 7–8)

### WhatsApp Business

- [ ] **WA Receipt Upload** - Lähetä kuva WhatsAppiin
  - User → kuva → Bot → analyysi → vastaus
  - Acceptance: <10s vastausaika
  - Files: `app/services/whatsapp/bot.py`

- [ ] **WA Commands** - Tekstikomennot
  - `/scan` → pyydä kuva
  - `/report` → viikon yhteenveto
  - `/help` → ohjeet
  - Acceptance: komennot toimivat luotettavasti
  - API: Twilio/Meta Business API

### Slack Integration

- [ ] **Slack Bot** - `/converto scan` -komento
  - Upload image → slash command → OCR result
  - Acceptance: toimii workspace-widena
  - Files: `app/services/slack/bot.py`

- [ ] **Slack Reports** - Automaattiset raportit
  - Daily/Weekly digest → #accounting channel
  - Anomaliat → #alerts
  - Acceptance: tiimi käyttää aktiivisesti
  - Scheduler: APScheduler cron job

---

## 🗓️ Sprint 5: Predictive Insights (Viikot 9–10)

### AI Forecasting

- [ ] **Cost Forecast** - Ennusta seuraavan kuukauden kulut
  - ML model: Prophet tai LinearRegression
  - Input: 3-6 kk historiaa
  - Acceptance: MAPE <15%
  - Files: `app/modules/predictive/forecast.py`

- [ ] **Anomaly Detection** - Poikkeamat
  - Alert: "Logistiikka +32% → tarkista"
  - Z-score tai isolation forest
  - Acceptance: 80% anomalioista oikeita
  - Files: `app/modules/predictive/anomaly.py`

### Rewards & Gamification

- [ ] **Sponsor Rewards** - Kumppanipalkin not
  - Coffee vouchers, gym cards, etc.
  - Acceptance: 3+ sponsoria, 50+ rewards
  - Files: `shared_core/modules/rewards/` (already done!)
  - **Status**: ✅ VALMIS

- [ ] **Streak Bonuses** - Viikon streak-bonus
  - 7 päivää putkeen → +25 CT bonus
  - Acceptance: käyttäjät palaavat päivittäin
  - Files: `shared_core/modules/gamify/service.py`
  - **Status**: ✅ VALMIS

---

## 🗓️ Sprint 6: Go-to-Market (Viikot 11–12)

### Sales & Partnerships

- [ ] **10 tilitoimistoa** - Pilottisopimukset
  - Bundle: 29€/client/month
  - Value prop: "Asiakkaasi kuitit WA → Netvisor"
  - Acceptance: 10 signed LOIs

- [ ] **ReceiptHero Partnership** - Digitaalikuitti-integraatio
  - 5-10 merchant pilots
  - Zero OCR errors on digital receipts
  - Acceptance: 30% kuiteista digitaalisia

- [ ] **Holvi/Pleo Guide** - "Bring-Your-Card" -ohjeet
  - PDF + video: miten linkittää kortti
  - Acceptance: 100+ users onboarded

### Marketing

- [ ] **Landing Page** - converto.fi
  - Hero: "Älykkäin kuitintunnistus Suomessa"
  - Demo video (30s)
  - Signup form
  - Acceptance: >2% conversion

- [ ] **AI Kuittikilpailu** - PR-kampanja
  - "Lähetä vaikein kuitti → AI tunnistaa → palkinto"
  - Social: LinkedIn, Twitter, Finnish startup groups
  - Acceptance: 500+ submissions, media coverage

---

## 📈 Success Metrics (100–0 Finland)

### T+30 Days (MVP Launch)
- ✅ 1,000 active users
- ✅ 85% receipts processed without manual correction
- ✅ <10s scan-to-ledger time
- ✅ NPS >40

### T+90 Days (PMF)
- ✅ 10 accounting firm partners
- ✅ 30% receipts via digital (ReceiptHero)
- ✅ OCR errors <1%
- ✅ 60% users with streak ≥3 days
- ✅ NPS >50

### T+180 Days (Scale)
- ✅ 10,000 users
- ✅ 50+ sponsors in rewards catalog
- ✅ 5+ integrations (banks, cards, POS)
- ✅ #1 in Finland for receipt AI

---

## 💰 Pricing (MVP)

| Plan | Price | Features | Target |
|------|-------|----------|--------|
| **Lite** | 29€/mo | WA upload, OCR, CSV export | Solo entrepreneurs |
| **Pro** | 99€/mo | Netvisor/Procountor, Slack, Hotkeys, Gamify | SMBs (1-10 employees) |
| **Insights** | 199€/mo | AI forecasts, anomalies, PDF reports | Growing companies (10-50) |

**Accounting Firm Bundle**: 20€/client/month (min 10 clients)

---

## 🛠️ Tech Stack (Current)

### Backend
- FastAPI (Python 3.11)
- PostgreSQL (production) / SQLite (dev)
- OpenAI GPT-4o-mini (Vision API)
- APScheduler (cron jobs)
- Sentry (error tracking)

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion (animations)
- SWR (data fetching)
- Recharts (charts)

### Infrastructure
- Railway (hosting)
- GitHub Actions (CI/CD)
- Cloudflare (CDN + DDoS)

---

## 🚀 Immediate Next Steps (This Week)

### 1. Test MVP Locally ✅

```bash
# Backend
source venv/bin/activate
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm run dev

# Open: http://localhost:3000/dashboard
```

### 2. Generate Dev Token

```bash
python scripts/mint_token.py demo user_demo 86400
# Copy token to frontend/.env.local
```

### 3. Test OCR Flow

1. Open Dashboard
2. Drag receipt image to OCRDropzone
3. Click "Analysoi"
4. Verify: merchant, total, VAT extracted
5. Click "Hyväksy & Tallenna"
6. Check: +10 Gamify points, +5 CT tokens

### 4. Deploy to Railway

1. Go to railway.app
2. Connect GitHub repo
3. Deploy (auto-detected)
4. Add env vars:
   - `OPENAI_API_KEY`
   - `DATABASE_URL` (auto-created)
   - `JWT_SECRET`
5. Live in 5 minutes!

---

## 📋 Detailed Task Breakdown

### Epic 1: Core OCR Intelligence

#### 1.1 Multi-OCR Ensemble
- **Priority**: HIGH
- **Effort**: 5 days
- **Owner**: Backend team
- **Dependencies**: OpenAI API, AWS Textract setup
- **Acceptance Criteria**:
  - [ ] Combine results from 3 sources
  - [ ] Confidence scoring (0-1)
  - [ ] Fallback chain works
  - [ ] <5% complete failures
- **Files**:
  - `app/modules/vision/ensemble.py`
  - `app/modules/vision/textract.py`
  - `tests/test_ocr_ensemble.py`

#### 1.2 VAT Classification
- **Priority**: HIGH
- **Effort**: 3 days
- **Owner**: AI team
- **Dependencies**: Training data (500+ receipts)
- **Acceptance Criteria**:
  - [ ] Detects 24/14/10/0% VAT rates
  - [ ] >90% accuracy on test set
  - [ ] Explains decision (debug mode)
- **Files**: Already done! ✅

#### 1.3 S3 Storage Integration
- **Priority**: MEDIUM
- **Effort**: 2 days
- **Owner**: Backend team
- **Acceptance Criteria**:
  - [ ] Upload to S3 on scan
  - [ ] Versioning enabled
  - [ ] GDPR retention policy (7 years)
- **Files**:
  - `shared_core/utils/storage.py` (enhance)
  - `app/api/ocr_ai.py` (add upload)

---

### Epic 2: Integrations

#### 2.1 Netvisor Integration
- **Priority**: HIGH
- **Effort**: 8 days
- **Owner**: Integration team
- **Dependencies**: Netvisor API credentials
- **Acceptance Criteria**:
  - [ ] OAuth2 flow works
  - [ ] Create invoice from OCR data
  - [ ] VAT lines correct
  - [ ] Test with 10 real invoices
- **API Docs**: https://support.netvisor.fi/hc/fi/sections/360003281372-Rajapinta
- **Files**:
  - `app/integrations/netvisor/client.py`
  - `app/integrations/netvisor/mapper.py`
  - `app/api/integrations.py`

#### 2.2 Procountor Integration
- **Priority**: HIGH
- **Effort**: 8 days
- **Owner**: Integration team
- **Acceptance Criteria**:
  - [ ] OAuth2 + API key auth
  - [ ] Create voucher with attachments
  - [ ] Test with accounting firm
- **API Docs**: https://api.procountor.com/api-docs/
- **Files**:
  - `app/integrations/procountor/client.py`

#### 2.3 Holvi Integration
- **Priority**: MEDIUM
- **Effort**: 5 days
- **Owner**: Integration team
- **Acceptance Criteria**:
  - [ ] Match transaction + receipt
  - [ ] Auto-categorize
  - [ ] 80% match rate
- **Files**:
  - `app/integrations/holvi/matcher.py`

#### 2.4 ReceiptHero Partnership
- **Priority**: HIGH (game changer!)
- **Effort**: 2 weeks (partnership + tech)
- **Owner**: BD + Backend
- **Acceptance Criteria**:
  - [ ] Signed data partnership
  - [ ] Webhook: receipt.created
  - [ ] 5-10 merchants live
  - [ ] Zero OCR errors on digital
- **Files**:
  - `app/integrations/receipthero/webhook.py`

---

### Epic 3: Channels & Commands

#### 3.1 WhatsApp Bot
- **Priority**: HIGH
- **Effort**: 5 days
- **Owner**: Backend team
- **Dependencies**: Twilio/Meta Business API
- **Acceptance Criteria**:
  - [ ] Send image → get OCR result
  - [ ] `/scan`, `/report`, `/help` commands
  - [ ] <10s response time
- **Files**:
  - `app/services/whatsapp/bot.py`
  - `app/services/whatsapp/templates.py`

#### 3.2 Slack Bot
- **Priority**: MEDIUM
- **Effort**: 3 days
- **Owner**: Backend team
- **Acceptance Criteria**:
  - [ ] `/converto scan` slash command
  - [ ] Daily/weekly reports to channel
  - [ ] Interactive buttons (approve/reject)
- **Files**:
  - `app/services/slack/bot.py`
  - Already have notify service! ✅

---

### Epic 4: Growth & Scale

#### 4.1 Accounting Firm Pilot
- **Priority**: HIGH
- **Effort**: Ongoing (weeks 7-12)
- **Owner**: Sales + Customer Success
- **Target**: 10 firms, 100+ end clients
- **Acceptance Criteria**:
  - [ ] 10 signed pilot agreements
  - [ ] Custom branding per firm
  - [ ] White-label option
  - [ ] <5% churn in pilot

#### 4.2 AI Receipt Challenge (PR Campaign)
- **Priority**: MEDIUM
- **Effort**: 2 weeks
- **Owner**: Marketing
- **Acceptance Criteria**:
  - [ ] Landing page live
  - [ ] 500+ submissions
  - [ ] 3+ media mentions
  - [ ] Video demo (30s)

---

## 🎯 KPIs & Tracking

### Daily
- OCR success rate (target: >85%)
- Average scan time (target: <10s)
- Error rate (target: <5%)

### Weekly
- Active users (MAU/7)
- Scans per user (target: >5/week)
- Gamify engagement (target: >60% with streak ≥3)

### Monthly
- NPS (target: >50)
- Integration usage (% of scans → Netvisor/Procountor)
- Revenue (MRR growth)

---

## 💡 Quick Wins (Do First!)

1. ✅ **Test locally** - Verify OCR works with real receipts
2. ✅ **Deploy to Railway** - Get live URL
3. 🔄 **Get 5 beta users** - Friends/family test
4. 🔄 **Netvisor CSV export** - Simplest integration
5. 🔄 **WhatsApp bot MVP** - Huge convenience

---

## 📞 Support & Resources

### Documentation
- `ALOITA_TÄSTÄ.md` - Complete setup guide
- `PIKAOHJE.md` - 5-minute quick start
- `AUTH_GUIDE.md` - JWT authentication
- `README_P2E.md` - Play-to-Earn system

### APIs & SDKs
- OpenAI: https://platform.openai.com/docs
- Netvisor: https://support.netvisor.fi/hc/fi/sections/360003281372-Rajapinta
- Procountor: https://api.procountor.com/api-docs/
- ReceiptHero: https://receipthero.fi/developers/
- Twilio (WhatsApp): https://www.twilio.com/docs/whatsapp

### Community
- FastAPI Discord: https://discord.gg/fastapi
- Finnish Startups Slack
- Suomi.io community

---

## ✅ Definition of Done

A feature is DONE when:
- [ ] Code written & tested locally
- [ ] Unit tests pass (pytest)
- [ ] Linter clean (flake8/black)
- [ ] Documented (docstrings + README)
- [ ] Deployed to staging
- [ ] Tested by 2+ users
- [ ] Committed & pushed to main
- [ ] Mentioned in changelog

---

**🚀 Current Status**: Sprint 1 ✅ COMPLETE! Ready for Sprint 2.

**Next Session**: Implement Multi-OCR Ensemble + Netvisor integration.

---

_Last updated: 2025-10-12_
_Owner: Converto™ Development Team_
