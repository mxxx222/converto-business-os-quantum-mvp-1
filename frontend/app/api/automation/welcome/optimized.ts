/**
 * Optimized Welcome Email with Scheduled Sequence
 * Migration from: frontend/app/api/automation/welcome/route.ts
 */

import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { leadId, email, name, company } = await req.json()

    // OPTIMIZED: Send immediate welcome email
    await resend.emails.send({
      from: "info@converto.fi", // Updated to verified domain
      to: email,
      subject: `${name}, tervetuloa Converto Business OS™ -ekosysteemiin!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563EB;">Tervetuloa Converto-ekosysteemiin!</h1>
          <p>Hei ${name},</p>
          <p>Kiitos kiinnostuksestasi Converto Business OS™:ää kohtaan! Olemme innoissamme mahdollisuudesta auttaa ${company}:a automatisoimaan prosesseja ja kasvattamaan liikevaihto.</p>
          <h2>Mitä seuraavaksi?</h2>
          <ol>
            <li><strong>Demo-kutsu</strong> - Saat kalenterikutsun 24 tunnin sisällä</li>
            <li><strong>Business OS™ -pääsy</strong> - 30 päivän ilmainen pilotti</li>
            <li><strong>ROI-analyysi</strong> - Näytämme konkreettiset säästöt</li>
          </ol>
          <p>Ystävällisin terveisin,<br><strong>Converto-tiimi</strong></p>
        </div>
      `,
    })

    // OPTIMIZED: Schedule follow-up sequence (Day 1, 3, 7)
    const now = new Date()
    
    // Day 1: Immediate (already sent above)
    
    // Day 3: Demo reminder
    const day3 = new Date(now)
    day3.setDate(day3.getDate() + 3)
    await resend.emails.send({
      from: "info@converto.fi",
      to: email,
      subject: `${name}, varataanpa demo-aika Business OS:lle?`,
      html: `<p>Hei ${name},<br>Haluaisitko varata demo-ajan? Vastaa tähän sähköpostiin!</p>`,
      scheduled_at: day3.toISOString(),
    })

    // Day 7: Final follow-up
    const day7 = new Date(now)
    day7.setDate(day7.getDate() + 7)
    await resend.emails.send({
      from: "info@converto.fi",
      to: email,
      subject: `${name}, kuinka voimme auttaa?`,
      html: `<p>Hei ${name},<br>Voimme auttaa optimoimaan ${company}:n prosesseja!</p>`,
      scheduled_at: day7.toISOString(),
    })

    return NextResponse.json({ 
      success: true, 
      message: "Welcome email sent + sequence scheduled",
    })
  } catch (error) {
    console.error('Welcome automation error:', error)
    return NextResponse.json(
      { error: "Failed to send welcome email" },
      { status: 500 }
    )
  }
}

