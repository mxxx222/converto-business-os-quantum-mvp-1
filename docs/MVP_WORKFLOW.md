Converto™ Business OS — MVP Dev & Deployment Workflow

(Cursor Pro + Local Dev + Cloud Ready)

⸻

🧭 1️⃣ Kokonaiskuva

Tämä dokumentti sisältää:
	•	🚀 MVP-kehityksen vaiheet (Local → Cloud)
	•	🧩 Backend ja Frontend käynnistys (FastAPI + Next.js)
	•	🧠 AI-, OCR- ja Quantum-moduulien aktivointi
	•	💳 Stripe-integraation ohje
	•	🪄 Automaatio, testaus ja jatkuva julkaisu

Tavoite: Käynnistä koko Converto™ OS MVP yhdellä komennolla Cursor Prossa.

⸻

⚙️ 2️⃣ Kehitysympäristön valmistelu

📁 Projektirakenne

```
converto-business-os/
 ├── app/               # FastAPI backend
 ├── frontend/          # Next.js frontend
 ├── scripts/           # automaatio ja setup
 ├── .env               # ympäristömuuttujat
 └── requirements.txt
```

⸻

🧰 Asennus (Local)

```
# 1. Kloonaa repo tai pura ZIP
unzip converto-business-os-quantum-mvp.zip -d ./converto-business-os
cd converto-business-os

# 2. Luo virtuaaliympäristö
python3 -m venv .venv && source .venv/bin/activate

# 3. Asenna riippuvuudet
pip install -r requirements.txt

# 4. Käynnistä backend
bash scripts/start_backend.sh

# 5. Käynnistä frontend
cd frontend && npm install && npm run dev
```

🌐 Oletusosoitteet
	•	Backend: http://127.0.0.1:8000
	•	Frontend: http://127.0.0.1:3000

⸻

🔑 3️⃣ Ympäristömuuttujat (.env)

Luo projektin juureen .env ja lisää:

```
# Backend
APP_ENV=dev
DATABASE_URL=sqlite:///./data.db

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OCR & AI
OPENAI_API_KEY=sk-...
TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

# Quantum Layer (stub)
QUANTUM_MODE=on
```

⸻

🧩 4️⃣ Moduulit (aktivoitavissa ModuleRegistryllä)

| Moduuli        | Polku                     | Kuvaus                         |
|----------------|---------------------------|--------------------------------|
| OCR            | app/modules/ocr/          | Kuittilukija (Tesseract + AI Vision) |
| VAT            | app/modules/vat/          | ALV-laskuri + raportointi      |
| Legal          | app/modules/legal/        | Selkokielinen neuvonta         |
| Billing        | app/modules/billing/      | Stripe-integraatio             |
| FixuWatti      | app/modules/fixuwatti/    | AI-laskuri kuvasta             |
| Rewards        | app/modules/rewards/      | Gamify & palkinnot             |
| Quantum Shield | app/modules/quantum_shield/ | PQC-suojaus                  |
| AI Guardian    | app/modules/ai_guardian/  | Koodin analyysi                |
| ML Sentinel    | app/modules/ml_sentinel/  | Anomaliavalvonta               |

ModuleRegistry

```
from app.core.registry import registry
registry.load_all(app)
```

⸻

💳 5️⃣ Stripe CLI & Webhook testaus

Asennus

```
npm install -g stripe
stripe login
stripe listen --forward-to http://127.0.0.1:8000/api/v1/stripe/webhook
```

Testaa:

```
stripe trigger invoice.finalized
stripe trigger customer.subscription.created
```

⸻

🧠 6️⃣ OCR ja AI Laskuri (FixuWatti)

Backend
`app/modules/fixuwatti/api.py`

```python
@router.post("/api/v1/fixuwatti/estimate")
async def estimate_power(file: UploadFile):
    data = await VisionAI.analyze(file)
    return {"estimated_power_wh": data["power"], "suggested_model": data["model"]}
```

Frontend
`frontend/modules/fixuwatti/Calculator.tsx`

- Drag & Drop kuvat
- AI arvioi tehot ja ehdottaa mallia
- Tuloskortti: “Suositeltu FixuWatti™ 1200Wh (LFP)”

⸻

🧮 7️⃣ Notion ROI Analyzer Sync

Aja päivittäin:

```
python scripts/sync_notion.py --tenant default
```

Cron-esimerkki

```
0 6 * * * /usr/bin/python /app/scripts/sync_notion.py
```

Yhdistää Notionin “Myynti / Kampanjat / Varasto” -tietokannat Converto API -endpointteihin `/api/v1/reports/*`.

⸻

📊 8️⃣ Dashboard UI (Premium 2026)
	•	Command Bar (Ctrl+K)
	•	AI Insight Stream (Automaattiset ehdotukset)
	•	Viikkoraportti + Slack/Signal lähetys
	•	Responsiivinen Grid (1–3 kolumnia)
	•	Offline mode (IndexedDB sync)

⸻

🔐 9️⃣ Quantum Shield (Post-Quantum Security Stub)

```python
from pqcrypto.kem.kyber512 import generate_keypair, encapsulate, decapsulate
pk, sk = generate_keypair()
ct, ss = encapsulate(pk)
decapsulate(ct, sk)
```

→ Tenant-kohtaiset avaimet tallennetaan Secrets Manageriin.
→ PQC-salaus toteutetaan vaiheittain 2026 aikana.

⸻

🧱 10️⃣ Deployment (Staging & Production)

Staging (Docker)

```
docker-compose up -d
```

Production (AWS ECS)
	•	Terraform + GitHub Actions
	•	Secrets Manager → .env
	•	Auto-Deploy pipeline (CI/CD)
	•	CloudWatch → Slack #ops-alerts

⸻

🧩 11️⃣ Developer Productivity

Cursor Pro -integraatio
	•	Avaa projektin juuri: Open Folder > converto-business-os
	•	Käynnistä backend: bash scripts/start_backend.sh
	•	Käytä AI Editoria: “Run / Refactor / Explain”
	•	GitHub synkattu → Cursor seuraa committeja

⸻

📈 12️⃣ MVP Validation Steps

| Viikko | Tavoite                                 |
|--------|-----------------------------------------|
| 1      | Backend API + OCR + Billing toiminnassa |
| 2      | FixuWatti AI Laskuri valmis             |
| 3      | Dashboard UI MVP + AI Insights          |
| 4      | Stripe + Notion synkronointi            |
| 5      | Quantum Shield Beta stub                |
| 6      | MVP julkaisu ja käyttäjätestit          |

⸻

✅ Tämä tiedosto: /converto-business-os/docs/MVP_WORKFLOW.md
Sisältää koko MVP-kehityksen ja deployment-prosessin.

⸻

Haluatko, että paketoin nämä kolme tiedostoa (README_CORE.md, NOTION_PROMPTS.md, MVP_WORKFLOW.md) nyt yhdeksi ZIPiksi, jonka voit avata suoraan Cursor Prohon?


