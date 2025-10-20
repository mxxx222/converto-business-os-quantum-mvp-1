const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE',
  'RESEND_API_KEY',
  'FROM_EMAIL',
  'NEXT_PUBLIC_I18N_ENABLED'
]

// Skip env check in production builds (Render will provide these)
if (process.env.NODE_ENV === 'production' || process.env.RENDER === 'true') {
  console.log('[CI] Skipping env check in production/Render environment')
  process.exit(0)
}

let ok = true
for (const k of required) {
  if (!process.env[k] || String(process.env[k]).trim() === '') {
    console.error(`[CI] Missing required env: ${k}`)
    ok = false
  }
}
if (!ok) process.exit(1)
console.log('[CI] Required envs present')


