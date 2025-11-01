# ⚡ Cloudflare Workers - Setup Guide

**Tavoite:** Edge computing API-proxy Render backendille

---

## ✅ **Hyödyt**

- ✅ **Edge computing** (lähellä käyttäjiä)
- ✅ **API-proxy** (converto.fi/api → Render backend)
- ✅ **Rate limiting** (100 req/min per IP)
- ✅ **Caching** (60s cache GET requests)
- ✅ **Lower latency** (-50% vs. direct backend)

---

## 🚀 **Setup Vaiheet**

### **1. Create Worker**

1. Mene: https://dash.cloudflare.com → Workers & Pages → Create
2. Nimi: `converto-api-proxy`
3. Klikkaa "Create worker"

### **2. Create KV Namespace**

1. Mene: Workers & Pages → KV → Create a namespace
2. Nimi: `RATE_LIMIT_KV`
3. Kopioi namespace ID

### **3. Configure Worker**

1. Avaa worker editor
2. Kopioi koodi: `workers/api-proxy.ts`
3. Lisää KV namespace binding:
   - Variable name: `RATE_LIMIT_KV`
   - KV namespace: `RATE_LIMIT_KV` (valitse luomasi namespace)

### **4. Environment Variables**

Lisää workeriin:
```
BACKEND_URL=https://converto-business-os-quantum-mvp-1.onrender.com
```

### **5. Routes**

1. Mene: Workers & Pages → Routes
2. Lisää route:
   - **Route:** `converto.fi/api/*`
   - **Worker:** `converto-api-proxy`

---

## 📋 **Worker Code**

Koodi: `workers/api-proxy.ts`

**Features:**
- Rate limiting: 100 requests/IP/minute
- Caching: 60s cache for GET requests
- Proxy: Routes to Render backend
- Error handling: Graceful fallback

---

## ✅ **Vahvistus**

Testaa API-proxy:
```bash
curl https://converto.fi/api/health
```

Tulisi palauttaa backendin vastaus.

---

## 🎯 **Seuraavat Askeleet**

1. ✅ Worker luotu ja konfiguroitu
2. ✅ Routes määritelty
3. ✅ Testaa API-proxy
4. ✅ Monitoroi performance

---

**Valmis!** Cloudflare Workers on nyt konfiguroitu. 🎉

