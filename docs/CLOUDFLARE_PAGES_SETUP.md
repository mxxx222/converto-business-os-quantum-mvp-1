# 🚀 Cloudflare Pages - Setup Guide

**Tavoite:** Deploy Converto Business OS frontend Cloudflare Pagesiin ilmaiseksi

---

## ✅ **Hyödyt**

- ✅ **Ilmainen hosting** (unlimited requests)
- ✅ **Automaattinen CDN** (200+ datacenter)
- ✅ **Instant SSL/TLS** (automaattinen)
- ✅ **Git-integration** (auto-deploy GitHubista)
- ✅ **Branch previews** (testi branches)
- ✅ **Edge Functions** (serverless)

---

## 🚀 **Setup Vaiheet**

### **1. Connect GitHub Repository**

1. Mene: https://dash.cloudflare.com → Pages → Create a project
2. Klikkaa "Connect to Git"
3. Valitse GitHub ja valitse repository: `converto-business-os-mvp`
4. Authorize Cloudflare

### **2. Configure Build Settings**

**Build configuration:**
```
Framework preset: Next.js
Build command: cd frontend && npm install && npm run build
Build output directory: frontend/.next
Root directory: /
```

**Environment variables:**
```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

### **3. Custom Domain**

1. Klikkaa "Custom domains" → "Set up a custom domain"
2. Syötä: `converto.fi`
3. Cloudflare luo automaattisesti SSL-sertifikaatin
4. Lisää DNS-tietueet:
   - **CNAME:** `converto.fi` → `pages.dev` subdomain
   - **CNAME:** `www.converto.fi` → `pages.dev` subdomain

### **4. Auto-Deploy**

- Deploy automatically: **Enabled**
- Production branch: `main`
- Preview deployments: **Enabled** (kaikki branches)

---

## 📋 **Build Configuration**

### **Build Command:**
```bash
cd frontend && npm install && npm run build
```

### **Build Output Directory:**
```
frontend/.next
```

### **Environment Variables:**
```bash
# Required
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Optional
RESEND_API_KEY=re_xxx
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXX
```

---

## 🔧 **Next.js Configuration**

Päivitä `frontend/next.config.js`:

```javascript
const nextConfig = {
  output: 'standalone', // For Cloudflare Pages
  images: {
    domains: ['cdn.converto.app', 'your-r2-bucket.r2.cloudflarestorage.com'],
  },
};
```

---

## ✅ **Vahvistus**

Kun deploy on valmis:
- ✅ Frontend saatavilla: `https://converto.fi`
- ✅ SSL/TLS automaattisesti
- ✅ CDN automaattisesti
- ✅ Auto-deploy GitHubista

---

## 🎯 **Seuraavat Askeleet**

1. ✅ Deploy frontend Cloudflare Pagesiin
2. ✅ Setup custom domain (converto.fi)
3. ✅ Configure Workers (API-proxy)
4. ✅ Migrate images to R2 Storage

---

**Valmis!** Cloudflare Pages on nyt konfiguroitu. 🎉

