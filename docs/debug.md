# Debug-liput

| Lippu | Tarkoitus | Yhdistettävä |
|-------|-----------|--------------|
| DEBUG_REDIS | Redis-kutsut (SCAN, set/del, hit/miss) | ✅ DEBUG_CACHE |
| DEBUG_SESSION | Session-cache-logit | ✅ DEBUG_CACHE |
| DEBUG_METRICS | Metrics-cache-logit | ✅ DEBUG_CACHE |
| DEBUG_CACHE | Globaalisti kaikki yllä | - |
| DEBUG_REDIS_LOCKS | Redis lock-metriikan logit | ✅ DEBUG_REDIS |

Esimerkki:

```
DEBUG_CACHE=true pnpm dev
DEBUG_REDIS=true DEBUG_METRICS=true pnpm dev
```

Suositus:
- Devissä: DEBUG_CACHE=true
- Stagingissa: DEBUG_METRICS=true
- Tuotannossa: ei lippuja

## CI Guard
CI estää buildin, jos DEBUG_* liput ovat totta ympäristössä tai .env.production-tiedostossa.

Esimerkit:

```
❌ [CI] DEBUG-liput päällä buildissa: DEBUG_CACHE, DEBUG_REDIS
✅ [CI] DEBUG-liput pois päältä – ok
```

App-kohtaiset polut (monorepo):
- Dashboard: apps/dashboard/scripts/*
- Billing: apps/billing/scripts/*
- Receipts: apps/receipts/scripts/*
- Legal: apps/legal/scripts/*

## CI Guard
CI estää buildin, jos DEBUG_* liput ovat totta ympäristössä tai .env.production‑tiedostossa.

### Esimerkit
❌ [CI] DEBUG-liput päällä buildissa: DEBUG_CACHE, DEBUG_REDIS
✅ [CI] DEBUG-liput pois päältä – ok
