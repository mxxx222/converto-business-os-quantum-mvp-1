# 💾 Cloudflare R2 Storage - Setup Guide

**Tavoite:** S3-compatible storage receipts, documents, and images

---

## ✅ **Hyödyt**

- ✅ **S3-compatible** (helppo integraatio)
- ✅ **Ei egress-kustannuksia** (Free tier)
- ✅ **CDN-integration** (nopea delivery)
- ✅ **Halvempi kuin S3** ($0.015/GB vs. $0.023/GB)
- ✅ **10GB free tier**

---

## 🚀 **Setup Vaiheet**

### **1. Create R2 Bucket**

1. Mene: https://dash.cloudflare.com → R2 → Create bucket
2. Bucket name: `converto-storage`
3. Location: Auto (lähin datacenter)
4. Klikkaa "Create bucket"

### **2. Generate API Token**

1. Mene: R2 → Manage R2 API Tokens → Create API token
2. Token name: `converto-r2-token`
3. Permissions: Object Read & Write
4. Kopioi:
   - **Access Key ID**
   - **Secret Access Key**
   - **Endpoint** (S3-compatible)

### **3. Configure Public Access**

1. Mene: R2 → converto-storage → Settings
2. Enable "Public Access"
3. Configure CORS:
   ```json
   [
     {
       "AllowedOrigins": ["https://converto.fi", "https://www.converto.fi"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

### **4. Custom Domain (Optional)**

1. Mene: R2 → converto-storage → Settings → Custom Domain
2. Domain: `cdn.converto.fi`
3. Cloudflare luo automaattisesti SSL

---

## 🔧 **Environment Variables**

Lisää Render/backend `.env`:
```bash
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
R2_BUCKET=converto-storage
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_PUBLIC_URL=https://cdn.converto.fi
```

Lisää Frontend `.env`:
```bash
NEXT_PUBLIC_R2_PUBLIC_URL=https://cdn.converto.fi
NEXT_PUBLIC_R2_BUCKET=converto-storage
```

---

## 📋 **Code Integration**

### **Frontend:**

Käytä: `frontend/lib/cloudflare-r2.ts`

```typescript
import { uploadToR2, getR2PublicUrl } from '@/lib/cloudflare-r2';

// Upload image
const { url, key } = await uploadToR2(file, {
  filename: 'receipt.jpg',
  contentType: 'image/jpeg',
  public: true,
});

// Get public URL
const publicUrl = getR2PublicUrl(key);
```

### **Backend:**

API routes: `frontend/app/api/storage/r2/upload/route.ts`

---

## ✅ **Vahvistus**

Testaa upload:
```bash
curl -X POST https://converto.fi/api/storage/r2/upload \
  -F "file=@test.jpg" \
  -F "filename=test.jpg" \
  -F "contentType=image/jpeg" \
  -F "public=true"
```

---

## 🎯 **Seuraavat Askeleet**

1. ✅ R2 bucket luotu
2. ✅ API token luotu
3. ✅ Code integroitu
4. ✅ Testaa upload/delete

---

## 💰 **Kustannukset**

**Free Tier:**
- 10GB storage
- Unlimited egress
- Unlimited requests

**Paid Tier ($0.015/GB):**
- Storage: $0.015/GB/month
- No egress costs

**Vs. Supabase Storage:**
- Storage: $0.021/GB
- Egress: $0.09/GB

**Säästö:** ~60% kun skaalautuu

---

**Valmis!** Cloudflare R2 Storage on nyt konfiguroitu. 🎉

