# Domain binding ja DNS ohjeet (Vercel + Render)

## 1) Vercel: Dashboard (Edge SSR)

- Konfiguraatio: `apps/dashboard/vercel.json`

```
{
  "framework": "nextjs",
  "edge": true,
  "regions": ["fra1"],
  "buildCommand": "npx turbo run build --filter=@converto/dashboard",
  "outputDirectory": ".next",
  "cleanUrls": true
}
```

- CI deploy (fra1):

```
vercel deploy apps/dashboard --prod --regions fra1 --token $VERCEL_TOKEN
vercel domains add dashboard.converto.fi --project converto-dashboard --token $VERCEL_TOKEN
vercel alias --token=$VERCEL_TOKEN <DEPLOY_URL> dashboard.converto.fi
```

## 2) Render: Domain-ohjeet

- Render UI: Service → Settings → Add Custom Domain → lisää: `dashboard.converto.fi`, `billing.converto.fi`, `receipts.converto.fi`, `legal.converto.fi`.
- DNS (Cloudflare tai muu registrar):

| Record | Type | Target | TTL |
|---|---|---|---|
| dashboard | CNAME | cname.render.com | Auto |
| billing | CNAME | cname.render.com | Auto |
| receipts | CNAME | cname.render.com | Auto |
| legal | CNAME | cname.render.com | Auto |

- Cloudflare: kytke proxy pois (harmaa pilvi) Renderin SSL-autentikoinnin vuoksi.

## 3) Pulumi: Render secrets (esimerkki)

Lisää Pulumissa ympäristömuuttuja Render-palveluun (viitteellinen esimerkki):

```
new render.EnvironmentVariable("NEXT_PUBLIC_API_BASE", {
  value: pulumi.interpolate`${apiBaseUrl}`,
  serviceName: "converto-dashboard"
})
```

Sama kaava `STRIPE_PUBLIC_KEY`, `SENTRY_DSN` arvoille. Huom: toteutus riippuu käytettävästä Render providerista/integraatiosta.

## 4) Verifiointi

- DNS:

```
# Vercel-suuntaus
 dig dashboard.converto.fi CNAME +short
 # odotettu: cname.vercel-dns.com tai cname.render.com
```

- Vercel domain status:

```
vercel domains inspect dashboard.converto.fi --token $VERCEL_TOKEN
```

Kun nämä ovat valmiit, dashboard toimii Edge-runtime:ssa, domainit sidotaan CI-deployhin ja DNS on dokumentoitu toistettavasti.
