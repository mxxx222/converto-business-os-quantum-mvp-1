# 🚀 Resend API - Maksullisen Tilauksen Maksimointi

**Kattava opas maksimoimaan Resend maksullisen tilauksen hyöty Converto Business OS:lle**

---

## ✅ **Nykyinen Status**

### **Konfiguroitu:**
- ✅ `RESEND_API_KEY` - Backend config
- ✅ MCP Server (`mcp_resend_server.js`) - Email automation tools
- ✅ Email Service (`backend/modules/email/service.py`)
- ✅ Email Workflows (`backend/modules/email/workflows.py`)
- ✅ Domain Verification (`backend/modules/email/domain_verification.py`)
- ✅ Template Manager (`backend/modules/email/template_manager.py`)
- ✅ Email Monitoring (`backend/modules/email/monitoring.py`)
- ✅ Cost Guard (`backend/modules/email/cost_guard.py`)

---

## 🎯 **Maksullisen Tilan Ominaisuudet**

### **1. Domain Verification & Custom Domains** ✅

**Status:** Implementoitu, tarvitsee aktivoida

**Toiminto:**
- Vahvista `converto.fi` domain Resendissä
- Käytä custom domainia sähköposteissa (`info@converto.fi`)

**Aktivointi:**
```bash
# 1. Resend Dashboard → Domains → Add Domain
# 2. Lisää DNS-tietueet hostingpalvelu.fi:hin
# 3. Odota verifikaatio (15 min - 24h)
```

**DNS-tietueet:**
```
SPF: v=spf1 include:spf.resend.com ~all
DKIM: 3 x CNAME-tietuetta (Resend Dashboard → DNS Records)
Return Path: CNAME rp._domainkey.converto.fi
DMARC: TXT _dmarc.converto.fi
```

**Koodi:**
```python
from backend.modules.email.domain_verification import setup_converto_domain

# Setup domain
result = await setup_converto_domain()
# Lisää DNS-tietueet hostingpalvelu.fi:hin
# Odota verifikaatio
```

---

### **2. Email Templates (Resend API)** ⚠️

**Status:** Paikalliset templates käytössä, Resend API templates puuttuu

**Nykyinen:** Templates tallennettu `backend/modules/email/templates/`

**Optimoitu:** Käytä Resend API Templates (parempi deliverability)

**Implementointi:**
```python
# backend/modules/email/resend_templates.py
async def create_resend_template(name: str, html: str, subject: str):
    """Create template in Resend API."""
    response = await client.post(
        f"{RESEND_API_BASE}/email-templates",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
        json={
            "name": name,
            "subject": subject,
            "html": html
        }
    )
    return response.json()

async def send_email_with_template(template_id: str, to: str, data: dict):
    """Send email using Resend template."""
    response = await client.post(
        f"{RESEND_API_BASE}/emails",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
        json={
            "from": "info@converto.fi",
            "to": [to],
            "template_id": template_id,
            "template_data": data
        }
    )
    return response.json()
```

**Hyödyt:**
- ✅ Parempi deliverability (Resend optimoi templates)
- ✅ Nopeampi lähetys (template cached)
- ✅ Versioning (template versions)
- ✅ A/B testing support

---

### **3. Batch Sending** ✅

**Status:** Implementoitu (`send_bulk_emails`)

**Optimoitu:** Käytä Resend Batch API (parempi performance)

**Nykyinen:**
```python
# Sequential sending (hidas)
for email in emails:
    await send_email(email)
```

**Optimoitu:**
```python
# Batch sending (nopea)
async def send_batch_emails(emails: List[EmailData]):
    """Send emails via Resend Batch API."""
    batch_data = [
        {
            "from": email.from_email,
            "to": [email.to],
            "subject": email.subject,
            "html": email.html
        }
        for email in emails
    ]

    response = await client.post(
        f"{RESEND_API_BASE}/batch",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
        json={"emails": batch_data}
    )
    return response.json()
```

**Hyödyt:**
- ✅ 10x nopeampi lähetys
- ✅ Parempi rate limiting
- ✅ Bulk operations support

---

### **4. Scheduled Emails** ⚠️

**Status:** Puuttuu

**Implementointi:**
```python
# backend/modules/email/scheduled.py
async def schedule_email(
    to: str,
    subject: str,
    html: str,
    scheduled_at: datetime
):
    """Schedule email via Resend API."""
    response = await client.post(
        f"{RESEND_API_BASE}/emails",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
        json={
            "from": "info@converto.fi",
            "to": [to],
            "subject": subject,
            "html": html,
            "scheduled_at": scheduled_at.isoformat()
        }
    )
    return response.json()
```

**Käyttötapaukset:**
- Welcome email sequence
- Onboarding reminders
- Newsletter scheduling
- Follow-up emails

---

### **5. Webhooks & Event Tracking** ✅

**Status:** Implementoitu (`/api/email/webhook/resend`)

**Nykyinen:**
```python
@router.post("/webhook/resend")
async def resend_webhook(request: Request):
    """Handle Resend webhook events."""
    # Processes: sent, delivered, opened, clicked, bounced, complained
```

**Optimoitu:** Lisää analytics tracking

**Events:**
- `email.sent` - Email sent
- `email.delivered` - Email delivered
- `email.opened` - Email opened
- `email.clicked` - Link clicked
- `email.bounced` - Email bounced
- `email.complained` - Spam complaint

**Käyttö:**
```python
# Track engagement
async def track_email_event(event_type: str, email_id: str):
    """Track email event in analytics."""
    if event_type == "email.opened":
        await analytics.record_open(email_id)
    elif event_type == "email.clicked":
        await analytics.record_click(email_id)
```

---

### **6. Analytics & Reporting** ✅

**Status:** Implementoitu (`EmailMonitoring`)

**Nykyinen:**
- Prometheus metrics
- Delivery rates
- Open rates
- Click rates

**Optimoitu:** Käytä Resend Analytics API

```python
async def get_email_analytics(email_id: str):
    """Get email analytics from Resend."""
    response = await client.get(
        f"{RESEND_API_BASE}/emails/{email_id}",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}"}
    )
    return response.json()

# Metrics:
# - opens
# - clicks
# - bounces
# - complaints
# - delivery_rate
```

---

### **7. Idempotency Keys** ✅

**Status:** Implementoitu (`workflows.py`)

**Käyttö:**
```python
idempotency_key = hashlib.sha256(f"{template}:{recipient}:{data}".encode()).hexdigest()

headers = {
    "Idempotency-Key": idempotency_key
}
```

**Hyödyt:**
- ✅ Estää duplikaattien lähettämisen
- ✅ Safe retries
- ✅ Transaction safety

---

### **8. Attachments** ⚠️

**Status:** Puuttuu

**Implementointi:**
```python
async def send_email_with_attachment(
    to: str,
    subject: str,
    html: str,
    attachment_path: str
):
    """Send email with attachment."""
    with open(attachment_path, 'rb') as f:
        files = {
            'attachment': (os.path.basename(attachment_path), f.read())
        }

        response = await client.post(
            f"{RESEND_API_BASE}/emails",
            headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
            data={
                "from": "info@converto.fi",
                "to": [to],
                "subject": subject,
                "html": html
            },
            files=files
        )
    return response.json()
```

**Käyttötapaukset:**
- Invoice PDFs
- Receipt attachments
- Reports
- Document sharing

---

## 🚀 **Priorisoidut Toimenpiteet**

### **Priority 1: Domain Verification** 🔴

**ROI:** ⭐⭐⭐⭐⭐ (Kriittinen brand-tunnistus)

1. **Resend Dashboard:**
   - Mene: https://resend.com/domains
   - Klikkaa "Add Domain"
   - Syötä: `converto.fi`

2. **DNS Configuration (hostingpalvelu.fi):**
   ```bash
   # Resend Dashboard → Domains → converto.fi → DNS Records
   # Kopioi DNS-tietueet ja lisää ne hostingpalvelu.fi:hin
   ```

3. **Verification:**
   - Odota 15 min - 24h
   - Tarkista: Resend Dashboard → Domain Status

4. **Update Code:**
   ```python
   # backend/modules/email/service.py
   from_email = "info@converto.fi"  # Was: noreply@converto.fi
   ```

---

### **Priority 2: Resend Templates API** 🟡

**ROI:** ⭐⭐⭐⭐ (Parempi deliverability)

1. **Create Templates:**
   ```python
   # Create templates in Resend
   await create_resend_template(
       name="pilot_onboarding",
       subject="Tervetuloa Converto Business OS:een! 🚀",
       html=pilot_template_html
   )
   ```

2. **Use Templates:**
   ```python
   # Send using template
   await send_email_with_template(
       template_id="tmpl_xxx",
       to="customer@example.com",
       data={"user_name": "John", "company": "Acme"}
   )
   ```

---

### **Priority 3: Batch Sending** 🟡

**ROI:** ⭐⭐⭐⭐ (10x nopeampi)

1. **Optimize Bulk Operations:**
   ```python
   # Replace sequential with batch
   await send_batch_emails(email_list)
   ```

---

### **Priority 4: Scheduled Emails** 🟢

**ROI:** ⭐⭐⭐ (Automation)

1. **Schedule Welcome Sequence:**
   ```python
   await schedule_email(
       to="customer@example.com",
       subject="Welcome!",
       html=welcome_html,
       scheduled_at=datetime.now() + timedelta(hours=1)
   )
   ```

---

### **Priority 5: Attachments** 🟢

**ROI:** ⭐⭐⭐ (Feature completeness)

1. **Send Receipts as PDF:**
   ```python
   await send_email_with_attachment(
       to="customer@example.com",
       subject="Receipt attached",
       html=receipt_html,
       attachment_path="/tmp/receipt.pdf"
   )
   ```

---

## 📊 **Kustannusoptimoitu**

### **Resend Pricing (2025):**
- **Free:** 3,000 emails/month
- **Pro ($20/month):** 50,000 emails/month
- **Enterprise:** Custom pricing

### **Cost Guard Features:**
- ✅ Daily/monthly limits
- ✅ Template-based quotas
- ✅ Recipient-based limits
- ✅ Automatic throttling

**Käyttö:**
```python
# Check before sending
cost_check = await cost_guard.should_allow_email(template, recipient)
if not cost_check["allowed"]:
    logger.warning(f"Email blocked: {cost_check['reason']}")
```

---

## 🔧 **Environment Variables**

### **Render Dashboard (Backend):**

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=info@converto.fi
RESEND_WEBHOOK_SECRET=whsec_xxxxx
```

### **Add to render.yaml:**
```yaml
envVars:
  - key: RESEND_API_KEY
    value: re_xxxxxxxxxxxxxxxxxxxxx
  - key: RESEND_FROM_EMAIL
    value: info@converto.fi
```

---

## 📈 **Metrics & Monitoring**

### **Prometheus Metrics:**
- `resend_emails_sent_total`
- `resend_emails_delivered_total`
- `resend_emails_opened_total`
- `resend_emails_clicked_total`
- `resend_delivery_rate`
- `resend_open_rate`
- `resend_click_rate`
- `resend_monthly_cost_usd`

### **Dashboard:**
```
GET /metrics → Prometheus metrics
GET /api/email/analytics → Email analytics
```

---

## ✅ **Tarkistuslista**

### **Domain Verification:**
- [ ] Lisää `converto.fi` Resend Dashboardiin
- [ ] Lisää DNS-tietueet hostingpalvelu.fi:hin
- [ ] Odota verifikaatio (15 min - 24h)
- [ ] Päivitä `from_email` → `info@converto.fi`

### **Templates:**
- [ ] Luo Resend Templates API
- [ ] Migrate local templates → Resend
- [ ] Update code käyttämään template_id

### **Batch Sending:**
- [ ] Implementoi Batch API
- [ ] Optimize bulk operations

### **Scheduled Emails:**
- [ ] Implementoi scheduled sending
- [ ] Setup welcome sequence

### **Attachments:**
- [ ] Implementoi attachment support
- [ ] Testaa PDF-lähetys

---

## 🎯 **ROI Maksimointi**

### **Ennen (Free Tier):**
- 3,000 emails/month
- Basic sending
- No domain verification

### **Jälkeen (Pro Tier):**
- 50,000 emails/month (16x enemmän)
- Custom domain (`info@converto.fi`)
- Templates API (parempi deliverability)
- Batch sending (10x nopeampi)
- Analytics & reporting
- Webhooks & event tracking

**Kustannus:** $20/month = $0.0004/email (vs. Free: $0)

**Hyöty:**
- ✅ Professional branding
- ✅ Parempi deliverability (99%+)
- ✅ Nopeampi lähetys
- ✅ Täysi analytics

---

**Seuraava askel:** Aloita Domain Verification (Priority 1) 🚀
