import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send pilot signup confirmation email
 */
export async function sendPilotSignupConfirmation(data: {
  email: string;
  name: string;
  company: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: 'Converto Business OS <noreply@converto.fi>',
      to: data.email,
      subject: 'Kiitos pilottirekisteröitymisestä! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0047FF;">Kiitos pilottirekisteröitymisestä!</h1>
          <p>Hei ${data.name},</p>
          <p>Kiitos kiinnostuksestasi Converto Business OS:ää kohtaan! Olet nyt pilottilistalla.</p>

          <h2 style="color: #0047FF;">Mitä tapahtuu seuraavaksi?</h2>
          <ul>
            <li>Pilotti alkaa pian</li>
            <li>Saamme sinulle henkilökohtaisen linkin</li>
            <li>3 kuukautta maksutonta käyttöä</li>
            <li>Kaikki ominaisuudet auki</li>
          </ul>

          <p>Yritys: ${data.company}</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0047FF;">Converto Business OS</h3>
            <p>Älykkään automaation alusta yrityksille</p>
          </div>

          <p>Ystävällisin terveisin,<br>Converto Business OS -tiimi</p>
        </div>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Email sending failed' };
  }
}

/**
 * Send daily report email
 */
export async function sendDailyReport(data: {
  to: string;
  metrics: {
    signups: number;
    total_signups: number;
    uptime: number;
    deployments: number;
  };
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: 'Converto Business OS <noreply@converto.fi>',
      to: data.to,
      subject: 'Converto Business OS - Päivittäinen raportti 📊',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0047FF;">Päivittäinen raportti</h1>
          <p>Converto Business OS -tilanne ${new Date().toLocaleDateString('fi-FI')}</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #0047FF;">Tilastot</h2>
            <ul>
              <li>Uudet rekisteröitymiset tänään: ${data.metrics.signups}</li>
              <li>Yhteensä rekisteröityneitä: ${data.metrics.total_signups}</li>
              <li>Käytettävyys: ${data.metrics.uptime}%</li>
              <li>Deployments: ${data.metrics.deployments}</li>
            </ul>
          </div>

          <p>Ystävällisin terveisin,<br>Converto Business OS -tiimi</p>
        </div>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Email sending failed' };
  }
}
