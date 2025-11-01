import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const lead = await req.json()

    // Store lead in database (placeholder - integrate with Supabase)
    console.log('New lead created:', lead)

    // Send to CRM system (placeholder - integrate with your CRM)
    await sendToCRMSystem(lead)

    // Trigger automation sequence
    await triggerLeadAutomation(lead)

    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (error) {
    console.error('CRM lead creation error:', error)
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    )
  }
}

async function sendToCRMSystem(lead: any) {
  // Placeholder for CRM integration (HubSpot, Pipedrive, etc.)
  // In production, integrate with your CRM API
  console.log('Sending to CRM:', lead)
}

async function triggerLeadAutomation(lead: any) {
  try {
    // Send lead notification to team
    await resend.emails.send({
      from: "crm@converto.fi",
      to: "team@converto.fi",
      subject: `New lead: ${lead.company} (${lead.stage})`,
      html: `
        <h2>New Lead Created</h2>
        <p><strong>Company:</strong> ${lead.company}</p>
        <p><strong>Contact:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Source:</strong> ${lead.source}</p>
        <p><strong>Stage:</strong> ${lead.stage}</p>
        <p><strong>Created:</strong> ${new Date(lead.createdAt).toLocaleString('fi-FI')}</p>
        
        <h3>Next Actions:</h3>
        <ul>
          <li>Follow up within 24 hours</li>
          <li>Schedule demo call</li>
          <li>Send Business OS access</li>
        </ul>
      `,
    })

    // Send welcome email to lead
    await resend.emails.send({
      from: "hello@converto.fi",
      to: lead.email,
      subject: "Tervetuloa Converto-ekosysteemiin!",
      html: `
        <h2>Kiitos kiinnostuksestasi!</h2>
        <p>Hei ${lead.name},</p>
        <p>Olemme vastaanottaneet yhteydenottosi ja otamme sinuun yhteyttä pian.</p>
        
        <h3>Mitä seuraavaksi?</h3>
        <ol>
          <li>Tiimimme ottaa yhteyttä 24 tunnin sisällä</li>
          <li>Sovimme demo-ajan Business OS™:lle</li>
          <li>Saat pääsyn 30 päivän ilmaiseen pilottiin</li>
        </ol>
        
        <p>Voit jo nyt tutustua:</p>
        <ul>
          <li><a href="https://app.converto.fi/demo">Business OS Demo</a></li>
          <li><a href="https://converto.fi/pricing">Hinnoittelu</a></li>
          <li><a href="https://converto.fi/business-os">Tuoteinfo</a></li>
        </ul>
        
        <p>Ystävällisin terveisin,<br>Converto-tiimi</p>
      `,
    })
  } catch (error) {
    console.error('Failed to trigger lead automation:', error)
  }
}