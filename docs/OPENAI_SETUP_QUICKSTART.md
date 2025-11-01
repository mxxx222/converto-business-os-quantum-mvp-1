# ⚡ OpenAI Optimization - Quick Setup

**Aika:** 5 min
**Vaadittu:** Redis (Docker tai paikallinen)

---

## 🚀 **Nopeat Askeleet**

### **1. Install Redis**

**Docker (suositus):**
```bash
docker run -d -p 6379:6379 --name redis-converto redis:7-alpine
```

**Tai paikallinen:**
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis
```

### **2. Install Python Package**

```bash
pip install redis>=5.0.0
```

### **3. Configure Environment**

Lisää `.env`:
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
OPENAI_CACHE_TTL=3600  # 1 hour
```

### **4. Test**

```bash
# Backend health check
curl http://localhost:8000/api/v1/ai/health

# Chat (should cache on second request)
curl -X POST http://localhost:8000/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

### **5. Deploy to Production**

**Render:**
1. Add Redis service (or use Upstash Redis)
2. Add environment variables:
   - `REDIS_HOST`
   - `REDIS_PORT`
   - `REDIS_DB`
   - `OPENAI_CACHE_TTL`

**Upstash Redis (suositus tuotannossa):**
```bash
# Free tier: 10K commands/day
# https://upstash.com/
```

---

## ✅ **Vahvistus**

Cache toimii kun:
- ✅ Ensimmäinen request: API call OpenAI
- ✅ Toinen request (sama): Cache HIT (ei API call)
- ✅ Logs näyttää: "Cache HIT" tai "Cache MISS"

---

## 📊 **Expected Results**

**Before:**
- Response time: 2000ms
- Cost: $50-200/kk
- Cache hit rate: 0%

**After:**
- Response time: 200ms (cached) / 2000ms (miss)
- Cost: $15-60/kk (-70%)
- Cache hit rate: 60-70%

---

**Valmis!** 🎉
