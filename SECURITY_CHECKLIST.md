# 🔒 Security Checklist - Before Deploy

## ⚠️ CRITICAL: API Keys & Secrets

### **✅ What Should NEVER Be in Code:**

```bash
# Check for leaked secrets:
git ls-files | xargs grep -i "sk-proj-"      # OpenAI keys
git ls-files | xargs grep -i "sk_live_"      # Stripe live keys
git ls-files | xargs grep -i "whsec_"        # Stripe webhook secrets
git ls-files | xargs grep -i "Bearer.*sk-"   # Bearer tokens
```

**If found:** Remove immediately and rotate keys!

---

## 🔐 Correct API Key Usage

### **Backend (Python):**

```python
# ✅ CORRECT - Load from environment
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ❌ WRONG - Hardcoded
client = OpenAI(api_key="sk-proj-...")  # NEVER DO THIS!
```

### **Frontend (Next.js):**

```typescript
// ✅ CORRECT - Server-side only
// app/api/ai/route.ts (API route)
const apiKey = process.env.OPENAI_API_KEY;

// ❌ WRONG - Client-side
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;  // NEVER!
```

---

## 🔑 Environment Variables

### **Development (.env):**

```env
# .env (NEVER commit this file!)
OPENAI_API_KEY=sk-proj-your-key-here
STRIPE_SECRET_KEY=sk_test_your-key-here
```

### **Production (Render):**

```
Render Dashboard → Service → Environment
→ Add Environment Variable
→ Key: OPENAI_API_KEY
→ Value: sk-proj-...
→ Save (encrypted at rest)
```

---

## 🛡️ Security Best Practices

### **1. Use Environment Variables**

```python
# ✅ Always use os.getenv()
api_key = os.getenv("OPENAI_API_KEY")

# ✅ Provide fallback for dev
api_key = os.getenv("OPENAI_API_KEY", "")

# ✅ Validate before use
if not api_key:
    raise ValueError("OPENAI_API_KEY not set")
```

### **2. Never Log Secrets**

```python
# ❌ WRONG
print(f"Using API key: {api_key}")

# ✅ CORRECT
print(f"Using API key: {api_key[:8]}...")  # Only first 8 chars
```

### **3. Rotate Keys Regularly**

```
OpenAI Dashboard → API Keys
→ Revoke old key
→ Create new key
→ Update in Render
→ Redeploy
```

### **4. Use Different Keys per Environment**

```env
# Development
OPENAI_API_KEY=sk-proj-dev-...

# Production
OPENAI_API_KEY=sk-proj-prod-...
```

### **5. Restrict API Key Permissions**

```
OpenAI Dashboard → API Keys → Permissions
→ Restrict to specific models
→ Set usage limits
→ Enable monitoring
```

---

## 🚨 If Key Leaked

**Immediate actions:**

1. **Revoke key immediately**
   ```
   OpenAI Dashboard → API Keys → Revoke
   ```

2. **Generate new key**
   ```
   OpenAI Dashboard → Create new key
   ```

3. **Update in Render**
   ```
   Render → Environment → Update OPENAI_API_KEY
   ```

4. **Check usage**
   ```
   OpenAI Dashboard → Usage
   → Check for unauthorized usage
   ```

5. **Rotate all secrets**
   ```
   Stripe, Sentry, Resend, etc.
   → Rotate as precaution
   ```

---

## ✅ Security Verification

Run before deploy:

```bash
# Check for secrets in code
./scripts/check_secrets.sh

# Or manually:
git ls-files | xargs grep -E "(sk-proj-|sk_live_|whsec_|Bearer sk-)" || echo "✅ Clean"
```

---

## 🔒 .gitignore Verification

Ensure these are ignored:

```
.env
.env.local
.env.production
*.key
*.pem
secrets/
credentials/
```

---

## 📋 Pre-Deploy Security Checklist

- [ ] No API keys in code
- [ ] No Bearer tokens hardcoded
- [ ] .env in .gitignore
- [ ] Environment variables documented in .env.example
- [ ] Different keys for dev/prod
- [ ] API keys have usage limits
- [ ] Secrets encrypted in Render
- [ ] HTTPS enforced
- [ ] CORS restricted to production domains
- [ ] Rate limiting enabled
- [ ] SQL injection prevention (use ORM)
- [ ] XSS prevention (no raw HTML)
- [ ] CSRF protection (SameSite cookies)
- [ ] Input validation (Pydantic)
- [ ] Error messages don't leak info
- [ ] Logging doesn't include secrets

---

## 🎯 Correct Authorization Header

### **In API Requests:**

```python
# ✅ CORRECT
headers = {
    "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
    "Content-Type": "application/json"
}

# ❌ WRONG
headers = {
    "Authorization": "Bearer OPENAI_API_KEY"  # Literal string!
}
```

### **In Fetch (Frontend):**

```typescript
// ✅ CORRECT - Call backend API route
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({ prompt })
});

// ❌ WRONG - Direct OpenAI call from frontend
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
  }
});
```

**Always proxy through backend!**

---

## 🔧 Quick Fix Script

```bash
#!/bin/bash
# scripts/check_secrets.sh

echo "🔍 Checking for leaked secrets..."

LEAKED=0

# Check for OpenAI keys
if git ls-files | xargs grep -E "sk-proj-[A-Za-z0-9]+" 2>/dev/null; then
    echo "❌ OpenAI API key found in code!"
    LEAKED=1
fi

# Check for Stripe keys
if git ls-files | xargs grep -E "sk_live_[A-Za-z0-9]+" 2>/dev/null; then
    echo "❌ Stripe secret key found in code!"
    LEAKED=1
fi

# Check for Bearer tokens
if git ls-files | xargs grep -E "Bearer sk-" 2>/dev/null; then
    echo "❌ Bearer token found in code!"
    LEAKED=1
fi

if [ $LEAKED -eq 0 ]; then
    echo "✅ No secrets found in code"
    exit 0
else
    echo "⚠️  SECRETS FOUND - FIX BEFORE DEPLOY!"
    exit 1
fi
```

---

## 📞 Support

**Security concerns?**
- Email: security@converto.fi
- Report: https://github.com/.../security

**Responsible disclosure:**
- We respond within 24 hours
- Bounty program (future)

---

**🔒 Security First - Always!**
