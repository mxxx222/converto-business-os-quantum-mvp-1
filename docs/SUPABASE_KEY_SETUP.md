# 🔑 Supabase API Key Setup

## ✅ Service Role Key Aktivoitu

**Supabase Service Role Key:**
```
sbp_3239ba703a96cee5e258396939111c5db2aecd9c
```

## 📋 Missä Tätä Käytetään

### **1. Backend.prev (Render / Local)**

**Environment Variable:**
```bash
SUPABASE_SERVICE_ROLE_KEY=sbp_3239ba703a96cee5e258396939111c5db2aecd9c
```

**Koodi:**
- `backend/config.py` - Lataa env-varista
- `shared_core/middleware/supabase_auth.py` - JWT validointi
- `shared_core/modules/supabase/` - Supabase client-kutsut

**Käyttötapaukset:**
- ✅ Admin-toiminnot (RLS bypass)
- ✅ JWT-token validointi
- ✅ Käyttäjähallinta
- ✅ Database-operaatiot

### **2. Frontend (Vercel / Render)**

**⚠️ Älä käytä Service Role Key frontendissa!**

Käytä sen sijaan **Anon Key** (public, safe for client):
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Hae Anon Key:**
1. Avaa Supabase Dashboard: https://app.supabase.com
2. Valitse projekti
3. Settings → API
4. Kopioi **"anon public"** key

## 🚀 Setup Ohjeet

### **Backend (Render)**

1. **Avaa Render Dashboard:**
   - https://dashboard.render.com
   - Valitse `converto-business-os-quantum-mvp-1` service

2. **Environment Variables:**
   ```
   SUPABASE_URL=https://pwghuqkxryxgnnsnsiah.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=sbp_3239ba703a96cee5e258396939111c5db2aecd9c
   SUPABASE_AUTH_ENABLED=true
   ```

3. **Save & Redeploy**

### **Local Development**

1. **Luo `.env` tiedosto:**
   ```bash
   cp .env.local.example .env
   ```

2. **Täydennä Supabase-asetukset:**
   ```bash
   SUPABASE_URL=https://pwghuqkxryxgnnsnsiah.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=sbp_3239ba703a96cee5e258396939111c5db2aecd9c
   SUPABASE_AUTH_ENABLED=true
   ```

3. **Käynnistä backend:**
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   ```

### **Frontend (Vercel / Render)**

1. **Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://pwghuqkxryxgnnsnsiah.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **⚠️ ÄLÄ käytä Service Role Key frontendissa!**
   - Se on admin-access key
   - Se voi ohittaa Row Level Security (RLS)
   - Se on turvallisuusriski selaimessa

## 🔒 Turvallisuus

### **Service Role Key:**
- ✅ Backend/server-side only
- ✅ Admin-toiminnot
- ✅ Bypassaa RLS (Row Level Security)
- ❌ ÄLÄ näytä selaimessa
- ❌ ÄLÄ committaa Git-repoon

### **Anon Key:**
- ✅ Frontend/client-side safe
- ✅ Noudattaa RLS-sääntöjä
- ✅ Voidaan näyttää koodissa
- ✅ Julkinen avain

## 📝 Tarkistus

### **Backend:**
```bash
# Health check
curl https://your-backend.onrender.com/health

# Test Supabase connection (jos API endpoint on)
curl https://your-backend.onrender.com/api/v1/supabase/test
```

### **Frontend:**
```bash
# Browser console
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
# Pitäisi näyttää Supabase URL

# Dashboard pitäisi toimia:
http://localhost:3000/dashboard
```

## ❓ Onko Jotain Puuttuu?

Jos Supabase ei toimi:

1. ✅ **SUPABASE_URL** asetettu?
2. ✅ **SUPABASE_SERVICE_ROLE_KEY** asetettu? (Backend)
3. ✅ **NEXT_PUBLIC_SUPABASE_ANON_KEY** asetettu? (Frontend)
4. ✅ **SUPABASE_AUTH_ENABLED=true**? (Backend)
5. ✅ Realtime enabled Supabase Dashboardissa?

## 📚 Lisätietoja

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Sentry & Supabase Activation](./SENTRY_SUPABASE_ACTIVATION.md)
- [Quick Setup Guide](../QUICK_SETUP_GUIDE.md)
