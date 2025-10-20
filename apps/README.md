# Modular Frontends (Micro-Frontends)

Planned apps:
- `apps/dashboard` (Edge SSR, real-time dashboards)
- `apps/billing` (SSG + ISR, product/pricing pages)
- `apps/receipts` (SSG + ISR, OCR views)
- `apps/legal` (SSG + ISR, compliance pages)

Build:
```
npm run build   # via turbo
```

Deploy each app to Edge (Render/Vercel) with its own domain or path.
