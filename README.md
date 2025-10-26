# 🚀 Converto Business OS - Quantum Edition

**AI-powered business management platform for Finnish entrepreneurs**

[![Production Ready](https://img.shields.io/badge/status-production%20ready-success)](https://github.com/mxxx222/converto-business-os-quantum-mvp-1)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.10-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 📦 Current Git Deployment Status

The local repository currently has no Git remotes configured, so the latest work-in-progress commit (`Add cron task modules for Render automation`) has not been pushed to GitHub. Configure a remote (for example, with `git remote add origin <repository-url>`) and run `git push -u origin work` to publish the branch.

To streamline the process, you can also execute `./scripts/push_to_github.sh` (optionally passing a different remote name as the first argument). The helper script verifies that a remote exists before attempting the push and reuses the current branch automatically.

## ✨ Features

### 🧾 OCR AI Receipt Scanning
- Drag & drop receipt upload
- AI-powered data extraction (OpenAI Vision)
- Automatic categorization
- VAT rate detection

### 🧮 VAT Calculator
- Regulatory-compliant rates (Vero.fi source)
- Versioned tax rates (historical + current)
- Automatic calculations
- PDF/CSV reports

### ⚖️ Legal Compliance Engine
- Finlex integration (Finnish legislation)
- Automatic law updates
- Risk assessment
- Compliance dashboard

### 🎮 Gamification
- Points and streaks
- Play-to-Earn tokens (CT)
- Rewards catalog
- Leaderboards

### 💳 Billing & Subscriptions
- Stripe integration
- Multiple pricing tiers
- Invoice history
- Payment management

---

## 🚀 Quick Start

### Local Development (Docker)
```bash
# Clone repository
git clone https://github.com/mxxx222/converto-business-os-quantum-mvp-1.git
cd converto-business-os-quantum-mvp-1

# Setup environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start all services
docker-compose up

# Open browser
open http://localhost:3000
```

### Frontend-only Development (Next.js)
```bash
# Start the Next.js dashboard in watch mode
npm run dev

# The command proxies to ./frontend so you can keep using the repository root
# Visit http://localhost:3000 once the server reports "Ready"
```

### Production Deployment (Render)
```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy to Render
# Follow guide in RENDER_DEPLOY_GUIDE.md

# 3. Setup pilot customer
./scripts/pilot_setup.sh "Company Name" "email@company.com"
```

---

## 📚 Documentation

- [**RENDER_DEPLOY_GUIDE.md**](RENDER_DEPLOY_GUIDE.md) - Step-by-step deployment
- [**PILOT_CHECKLIST.md**](PILOT_CHECKLIST.md) - Customer onboarding
- [**FINAL_STATUS.md**](FINAL_STATUS.md) - Complete feature list
- [**README_CORE.md**](README_CORE.md) - Architecture details

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js 14    │  Frontend (Premium UI)
│   + Tailwind    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    FastAPI      │  Backend (REST API)
│  + PostgreSQL   │
│  + Redis        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OpenAI Vision  │  AI Services
│  Stripe API     │
│  Finlex RSS     │
└─────────────────┘
```

---

## 🎯 Tech Stack

**Frontend:**
- Next.js 14.2.10
- React 18.3.1
- Tailwind CSS 3.4.10
- Framer Motion
- shadcn/ui

**Backend:**
- FastAPI
- PostgreSQL
- Redis
- SQLAlchemy
- APScheduler

**AI/ML:**
- OpenAI GPT-4o-mini (Vision)
- Tesseract OCR
- scikit-learn (future)

**Infrastructure:**
- Docker + docker-compose
- Render (deployment)
- GitHub Actions (CI/CD)

---

## 💰 Pricing

| Plan | Price | Features |
|------|-------|----------|
| **Lite** | 29 €/month | OCR, VAT calculator, Basic reports |
| **Pro** | 49 €/month | + AI Chat, Advanced reports, Gamification |
| **Insights** | 99 €/month | + Legal Engine, Predictive analytics, Priority support |

---

## 📊 Status

- ✅ **38 commits** - Production ready
- ✅ **12 pages** - Fully functional
- ✅ **15 API modules** - Tested
- ✅ **Docker ready** - One-command startup
- ✅ **Render ready** - Blueprint deployment

---

## 🤝 Contributing

This is a commercial project. For partnership inquiries, contact: hello@converto.fi

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🎉 Ready for Production!

**Deploy now:** Follow [RENDER_DEPLOY_GUIDE.md](RENDER_DEPLOY_GUIDE.md)

**Questions?** Open an issue or contact support.

---

**Made with ❤️ in Finland 🇫🇮**

---

## 🧱 Technical Debt / TODO

- [ ] mypy cleanup across workspace
  - Scope: fix typing errors flagged by pre-commit mypy across `app/core`, `app/api`, `app/modules`, and related packages.
  - Approach: add missing return/type hints, install stubs for third-party libs (e.g., `types-PyYAML`), reduce `Any` usage; consider relaxing mypy per-module temporarily and tighten iteratively.
  - Note: non-blocking for deploys; address in a follow-up sprint.
