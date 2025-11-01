import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { leadId, email, name, company } = await req.json()

    // Send welcome email sequence
    await resend.emails.send({
      from: "hello@converto.fi",
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
          
          <h2>Voit jo nyt tutustua:</h2>
          <ul>
            <li><a href="https://app.converto.fi/demo" style="color: #2563EB;">Business OS™ Demo</a></li>
            <li><a href="https://converto.fi/pricing" style="color: #2563EB;">Hinnoittelu</a></li>
            <li><a href="https://converto.fi/palvelut/automaatio" style="color: #2563EB;">Automation Consulting™</a></li>
          </ul>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">💡 Vinkki:</h3>
            <p>Keskimäärin asiakkaamme säästävät <strong>40% työajasta</strong> ja kasvattavat liikevaihtoa <strong>25%</strong> ensimmäisen vuoden aikana.</p>
          </div>
          
          <p>Jos sinulla on kysymyksiä, vastaa tähän sähköpostiin tai käytä chat-bottiamme sivustolla.</p>
          
          <p>Ystävällisin terveisin,<br>
          <strong>Converto-tiimi</strong><br>
          hello@converto.fi</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="font-size: 12px; color: #6B7280;">
            Converto Solutions Oy | Y-tunnus: 1234567-8<br>
            <a href="https://converto.fi/privacy" style="color: #6B7280;">Tietosuoja</a> | 
            <a href="https://converto.fi/terms" style="color: #6B7280;">Käyttöehdot</a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, message: "Welcome email sent" })
  } catch (error) {
    console.error('Welcome automation error:', error)
    return NextResponse.json(
      { error: "Failed to send welcome email" },
      { status: 500 }
    )
  }
}