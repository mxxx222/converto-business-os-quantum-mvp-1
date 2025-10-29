import { Resend } from 'resend'

function sanitize(s?: string) {
  return (s ?? '').slice(0, 2000).replace(/[<>]/g, '')
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const email = sanitize(form.get('email') as string)
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!email || !valid) return new Response('Invalid email', { status: 400 })

    const name = sanitize(form.get('name') as string)
    const company = sanitize(form.get('company') as string)
    const phone = sanitize(form.get('phone') as string)
    const note = sanitize(form.get('note') as string)

    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.LEADS_TO
    const from = process.env.FROM_ADDR || 'Converto Leads <no-reply@converto.fi>'
    if (!apiKey || !to) return new Response('Missing email config', { status: 500 })

    const resend = new Resend(apiKey)
    const html = `
      <h2>Uusi pilotti‑ilmoittautuminen</h2>
      <p><b>Email:</b> ${email}</p>
      <p><b>Nimi:</b> ${name || '-'}</p>
      <p><b>Yritys:</b> ${company || '-'}</p>
      <p><b>Puhelin:</b> ${phone || '-'}</p>
      <p><b>Viesti:</b><br/>${(note || '-').replace(/\n/g,'<br/>')}</p>
    `

    await resend.emails.send({ from, to, subject: 'Pilotti‑ilmoittautuminen', html })
    await resend.emails.send({ from, to: email, subject: 'Kiitos ilmoittautumisesta – Converto™', html: '<p>Kiitos! Palaamme pilottiaikataululla 1 arkipäivän sisällä.</p>' })

    return new Response(null, { status: 200 })
  } catch (e) {
    console.error(e)
    return new Response('Error', { status: 500 })
  }
}
