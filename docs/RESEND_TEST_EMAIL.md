# 📧 Resend Test Email Guide

**Ohje testisähköpostin lähettämiseen Resend API:n kautta**

---

## ✅ **Konfiguraatio Valmis**

### **Environment Variables (Render):**
- ✅ `RESEND_API_KEY` - Resend API avain
- ✅ `RESEND_FROM_EMAIL` - `info@converto.fi` (custom domain)

### **Koodi Päivitetty:**
- ✅ `backend/config.py` - Käyttää `RESEND_FROM_EMAIL` env-varia
- ✅ `backend/modules/email/service.py` - Oletusarvo `info@converto.fi`
- ✅ `backend/modules/email/router.py` - Käyttää `RESEND_FROM_EMAIL` oletusarvona
- ✅ `/api/v1/email/test` endpoint luotu

---

## 🚀 **Testisähköpostin Lähettäminen**

### **1. API Endpoint:**
```
POST /api/v1/email/test?to=your@email.com
```

### **2. Käyttö Esimerkit:**

#### **cURL:**
```bash
curl -X POST "https://api.converto.fi/api/v1/email/test?to=max@herbspot.fi" \
  -H "Content-Type: application/json"
```

#### **Python:**
```python
import requests

response = requests.post(
    "https://api.converto.fi/api/v1/email/test",
    params={"to": "max@herbspot.fi"}
)
print(response.json())
```

#### **JavaScript/TypeScript:**
```typescript
const response = await fetch(
  'https://api.converto.fi/api/v1/email/test?to=max@herbspot.fi',
  { method: 'POST' }
);
const result = await response.json();
console.log(result);
```

### **3. Odotettu Vastaus:**
```json
{
  "success": true,
  "message": "Test email sent successfully",
  "from": "info@converto.fi",
  "to": "max@herbspot.fi",
  "email_id": "resend_email_id_here"
}
```

---

## 📋 **Testisähköpostin Sisältö**

Testisähköposti sisältää:
- ✅ Vahvistusviestin että sähköposti lähetettiin onnistuneesti
- ✅ Custom domain `info@converto.fi` vahvistus
- ✅ Lähettäjän ja vastaanottajan tiedot
- ✅ Lähetysaika

---

## 🔍 **Troubleshooting**

### **Jos testisähköposti epäonnistuu:**

1. **Tarkista RESEND_API_KEY:**
   - Render Dashboard → Environment Variables
   - Varmista että `RESEND_API_KEY` on asetettu

2. **Tarkista RESEND_FROM_EMAIL:**
   - Varmista että `RESEND_FROM_EMAIL=info@converto.fi`
   - Tarkista Render Dashboard → Environment Variables

3. **Tarkista Domain Verification:**
   - Resend Dashboard → Domains → `converto.fi`
   - Status pitäisi olla "verified"
   - Jos ei, odota DNS-propagointia (5-60 min)

4. **Tarkista API Endpoint:**
   ```bash
   curl https://api.converto.fi/api/v1/email/health
   ```

---

## 🎯 **Seuraavat Askeleet**

1. **Odotetaan DNS-propagointia** (jos domain ei vielä verified)
2. **Lähetetään testisähköposti** vahvistaakseen toimivuuden
3. **Tarkistetaan Resend Dashboardissa** että sähköposti toimitettiin

---

**📄 Dokumentaatio:**
- `RESEND_DOMAIN_SETUP.md` - Domain setup
- `docs/RESEND_MAXIMIZATION_GUIDE.md` - Maksimointi-opas
