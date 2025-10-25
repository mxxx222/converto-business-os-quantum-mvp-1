# Vercel Quick Start - Hobby Setup

## 🚀 5-Minute Deploy

### 1. Vercel Dashboard Setup
1. **Go to**: https://vercel.com/dashboard
2. **New Project** → Import Git Repository
3. **Repository**: `mxxx222/converto-business-os-quantum-mvp-1`
4. **Configure**:
   - Framework: `Next.js`
   - Root Directory: `apps/dashboard`
   - Install Command: `npm ci`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 2. Environment Variables (Copy-Paste)
**Vercel → Project → Settings → Environment Variables**

```bash
# Frontend (NEXT_PUBLIC_*)
NEXT_PUBLIC_BASE_URL=https://app.converto.fi
NEXT_PUBLIC_I18N_ENABLED=true
NEXT_PUBLIC_CSV_EXPORT_ENABLED=true
NEXT_PUBLIC_UPLOAD_V2_ENABLED=false
NEXT_PUBLIC_SECURITY_STRICT_HEADERS=false
NEXT_PUBLIC_OCR_PROVIDER=tesseract

# Server (NO NEXT_PUBLIC_)
NODE_ENV=production
FROM_EMAIL=noreply@converto.fi
RESEND_API_KEY=
NEXT_TELEMETRY_DISABLED=1
```

### 3. Deploy & Test
1. **Deploy** → Wait for build (2-3 min)
2. **Test**:
   ```bash
   # Backend test
   curl https://converto-business-os-quantum-mvp-1.onrender.com/health

   # Frontend test (after Vercel deploy)
   curl https://your-vercel-domain.vercel.app
   ```

### 4. Smoke Test (After Both Deploy)
```bash
# Set URLs
export FRONTEND_URL=https://your-vercel-domain.vercel.app
export BACKEND_URL=https://converto-business-os-quantum-mvp-1.onrender.com

# Run test
./scripts/smoke-test.sh
```

## ✅ Expected Results
- **Backend**: `{"status":"ok"}` at `/health`
- **Frontend**: 200 OK at root
- **Build time**: 2-3 minutes
- **Cost**: $0 (Hobby plan)

## 🔄 Upgrade to Pro (When Needed)
- **Team Settings** → Upgrade to Pro
- **No downtime** during upgrade
- **Billing starts** from upgrade moment

## 🎯 ROI
- **Setup time**: 5-10 min
- **Build success**: 99%+ (vs Render 60-70%)
- **Deploy speed**: 2-3 min (vs Render 5-10 min)
- **Maintenance**: Minimal
