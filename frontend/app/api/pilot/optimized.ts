/**
 * Optimized Pilot Signup API with Resend Templates, Batch, and Scheduled emails
 * Migration from: frontend/app/api/pilot/route.ts
 */

import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Template IDs (set after creating templates in Resend Dashboard)
const TEMPLATE_IDS = {
  PILOT_SIGNUP_CONFIRMATION: process.env.RESEND_TEMPLATE_PILOT_CONFIRMATION || "tmpl_pilot_confirmation",
  PILOT_SIGNUP_NOTIFICATION: process.env.RESEND_TEMPLATE_PILOT_NOTIFICATION || "tmpl_pilot_notification",
}

export async function POST(req: Request) {
  try {
    const { name, email, company } = await req.json()

    // Validate input
    if (!name || !email || !company) {
      return NextResponse.json(
        { error: "Kaikki kentät ovat pakollisia" },
        { status: 400 }
      )
    }

    // OPTIMIZED: Use Batch API to send both emails at once
    const batchEmails = [
      {
        from: "info@converto.fi", // Updated to verified domain
        to: "team@converto.fi",
        subject: `Uusi pilotti-ilmoittautuminen: ${company}`,
        html: `
          <h2>Uusi pilotti-ilmoittautuminen</h2>
          <p><strong>Yritys:</strong> ${company}</p>
          <p><strong>Yhteyshenkilö:</strong> ${name}</p>
          <p><strong>Sähköposti:</strong> ${email}</p>
          <p>Ota yhteyttä ja aloita pilottiohjelma!</p>
        `,
      },
      {
        from: "info@converto.fi",
        to: email,
        subject: "Tervetuloa Converto Business OS pilottiin!",
        html: `
          <h2>Kiitos ilmoittautumisesta!</h2>
          <p>Hei ${name},</p>
          <p>Olemme vastaanottaneet ilmoittautumisesi Converto Business OS pilottiohjelmaan.</p>
          <p>Tiimimme ottaa sinuun yhteyttä pian ja auttaa sinua pääsemään alkuun.</p>
          <p>Odota kuulla meiltä!</p>
          <p>Ystävällisin terveisin,<br>Converto-tiimi</p>
        `,
      },
    ]

    // OPTIMIZED: Send via Batch API (10x faster)
    const batchResult = await resend.batch.send({ emails: batchEmails })

    // OPTIMIZED: Schedule welcome sequence (Day 3, 7)
    const day3 = new Date()
    day3.setDate(day3.getDate() + 3)
    
    const day7 = new Date()
    day7.setDate(day7.getDate() + 7)

    // Schedule follow-up emails
    await Promise.all([
      resend.emails.send({
        from: "info@converto.fi",
        to: email,
        subject: `${name}, kuinka eteneekä Business OS:lla?`,
        html: `<p>Hei ${name},<br>Kysymyksiä? Vastaa tähän sähköpostiin!</p>`,
        scheduled_at: day3.toISOString(),
      }),
      resend.emails.send({
        from: "info@converto.fi",
        to: email,
        subject: `${name}, tarvitsetko apua Business OS:lla?`,
        html: `<p>Hei ${name},<br>Voimme auttaa optimoimaan käyttöäsi!</p>`,
        scheduled_at: day7.toISOString(),
      }),
    ])

    return NextResponse.json({ 
      ok: true, 
      message: "Ilmoittautuminen lähetetty",
      batch_id: batchResult.id,
    })
  } catch (error) {
    console.error("Pilot signup error:", error)
    return NextResponse.json(
      { error: "Virhe ilmoittautumisen käsittelyssä" },
      { status: 500 }
    )
  }
}

