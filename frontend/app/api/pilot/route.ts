import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Send email to team
    await resend.emails.send({
      from: "pilot@converto.fi",
      to: "team@converto.fi",
      subject: `Uusi pilotti-ilmoittautuminen: ${company}`,
      html: `
        <h2>Uusi pilotti-ilmoittautuminen</h2>
        <p><strong>Yritys:</strong> ${company}</p>
        <p><strong>Yhteyshenkilö:</strong> ${name}</p>
        <p><strong>Sähköposti:</strong> ${email}</p>
        <p>Ota yhteyttä ja aloita pilottiohjelma!</p>
      `,
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: "pilot@converto.fi",
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
    })

    return NextResponse.json({ ok: true, message: "Ilmoittautuminen lähetetty" })
  } catch (error) {
    console.error("Pilot signup error:", error)
    return NextResponse.json(
      { error: "Virhe ilmoittautumisen käsittelyssä" },
      { status: 500 }
    )
  }
}