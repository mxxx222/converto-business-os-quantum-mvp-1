/**
 * Optimized Resend API wrapper with Templates, Batch, Scheduled, and Attachments
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_API_BASE = "https://api.resend.com"

interface EmailData {
  from: string
  to: string | string[]
  subject: string
  html: string
  scheduled_at?: string
  reply_to?: string
  attachments?: Array<{
    filename: string
    content: string // base64 encoded
  }>
}

interface BatchEmailData {
  emails: EmailData[]
}

/**
 * Send batch emails via Resend Batch API
 */
export async function sendBatchEmails(emails: EmailData[]) {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured")
  }

  const response = await fetch(`${RESEND_API_BASE}/batch`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emails }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend Batch API error: ${error}`)
  }

  return response.json()
}

/**
 * Send email with template
 */
export async function sendEmailWithTemplate(
  templateId: string,
  to: string | string[],
  templateData: Record<string, any>,
  from: string = "info@converto.fi"
) {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured")
  }

  const response = await fetch(`${RESEND_API_BASE}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      template_id: templateId,
      template_data: templateData,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend API error: ${error}`)
  }

  return response.json()
}

/**
 * Schedule email for future delivery
 */
export async function scheduleEmail(
  to: string | string[],
  subject: string,
  html: string,
  scheduledAt: Date,
  from: string = "info@converto.fi"
) {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured")
  }

  const response = await fetch(`${RESEND_API_BASE}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? [to] : [to],
      subject,
      html,
      scheduled_at: scheduledAt.toISOString(),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend API error: ${error}`)
  }

  return response.json()
}

/**
 * Send email with attachment
 */
export async function sendEmailWithAttachment(
  to: string | string[],
  subject: string,
  html: string,
  attachment: { filename: string; content: string }, // content is base64
  from: string = "info@converto.fi"
) {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured")
  }

  const response = await fetch(`${RESEND_API_BASE}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      attachments: [attachment],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend API error: ${error}`)
  }

  return response.json()
}

/**
 * Get email analytics
 */
export async function getEmailAnalytics(emailId: string) {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not configured")
  }

  const response = await fetch(`${RESEND_API_BASE}/emails/${emailId}`, {
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend API error: ${error}`)
  }

  return response.json()
}

