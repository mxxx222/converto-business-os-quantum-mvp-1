# 📸 OCR AI - Smart Receipt Recognition

## Overview

Converto's OCR AI system extracts structured data from receipts using:
- **OpenAI Vision API** (GPT-4o-mini)
- **AI Classifier** (category, VAT, budget line)
- **Automation Engine** (Gamify, ROI, notifications)

---

## Features

### 1. Vision Extraction
- Merchant name
- Date (YYYY-MM-DD)
- Total amount
- VAT (rate % + amount)
- Line items (name, qty, unit price)
- Payment method

### 2. AI Classification
- **Category**: Groceries, Fuel, Tools, Meals, General
- **VAT rate**: 24%, 14%, 10%, 0%
- **Budget line**: OPEX/CAPEX classification
- **GL account**: Accounting code suggestion

### 3. Automations
- Create ledger entry
- Award Gamify points (+10p)
- Update ROI forecast
- Send notifications (if large amount)

---

## API Endpoints

### POST /api/v1/ocr/scan

Upload receipt image and get structured data.

**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/ocr/scan \
  -F "file=@receipt.jpg" \
  -F "tenant_id=demo" \
  -F "user_id=user_demo"
```

**Response:**
```json
{
  "ok": true,
  "result": {
    "receipt_id": "rcpt_000001",
    "data": {
      "merchant": "K-Market Keskuskatu",
      "date": "2025-10-12",
      "total": 23.45,
      "vat": 24,
      "category": "Groceries",
      "budget_line": "OPEX:Office:Snacks",
      "items": [...]
    }
  }
}
```

### GET /api/v1/ocr/recent

Get recent scans for a tenant.

**Request:**
```bash
curl "http://localhost:8000/api/v1/ocr/recent?tenant_id=demo"
```

**Response:**
```json
{
  "items": [
    {
      "id": "rcpt_000001",
      "tenant_id": "demo",
      "user_id": "user_demo",
      "data": {...},
      "created_at": "2025-10-12T10:30:00"
    }
  ]
}
```

---

## Frontend Components

### OCRDropzone
Drag & drop file upload with real-time scanning.

```tsx
import { OCRDropzone } from '@/modules/ocr';

<OCRDropzone onResult={(result) => console.log(result)} />
```

### OCRHotkeys
Keyboard shortcuts for power users.

```tsx
import { OCRHotkeys } from '@/modules/ocr';

<OCRHotkeys onOpen={() => setOpen(true)} />
```

**Available hotkeys:**
- `Shift + O` → Open scan
- `Shift + S` → Show latest
- `Shift + R` → Rescan

### OCRPreview
Edit extracted data before confirmation.

```tsx
import { OCRPreview } from '@/modules/ocr';

<OCRPreview
  data={extractedData}
  onConfirm={(edited) => saveToDB(edited)}
/>
```

### OCRRecent
Show recent scans in sidebar.

```tsx
import { OCRRecent } from '@/modules/ocr';

<OCRRecent />
```

---

## Usage Example

Full page with all components:

```tsx
// app/ocr/page.tsx
"use client";
import { useState } from "react";
import { OCRDropzone, OCRHotkeys, OCRPreview, OCRRecent } from "@/modules/ocr";

export default function OCRPage() {
  const [result, setResult] = useState(null);

  return (
    <div>
      <OCRHotkeys onOpen={() => setOpen(true)} />
      <OCRDropzone onResult={setResult} />
      {result && <OCRPreview data={result.data} onConfirm={save} />}
      <OCRRecent />
    </div>
  );
}
```

---

## Configuration

### Environment Variables

```bash
# Backend (.env)
OPENAI_API_KEY=sk-proj-...
OPENAI_VISION_MODEL=gpt-4o-mini

# Frontend (.env.local)
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

---

## Development

### Run locally

```bash
# Backend
source venv/bin/activate
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev

# Open
open http://localhost:3000/selko/ocr
```

### Test OCR

1. Navigate to `/selko/ocr`
2. Drag receipt image or click to upload
3. Wait for AI analysis
4. Edit fields if needed
5. Click "Vahvista"

---

## Roadmap

- [ ] Multi-OCR ensemble (Vision + Textract + Tesseract)
- [ ] Real DB persistence (replace in-memory store)
- [ ] Netvisor/Procountor integration
- [ ] WhatsApp bot upload
- [ ] Offline mode (Tesseract fallback)
- [ ] ML model for better classification

---

**Questions?** See `app/modules/vision/` for implementation details.
