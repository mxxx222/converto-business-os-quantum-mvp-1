import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.FROM_EMAIL!;
const TO = process.env.REPORT_EMAILS!.split(","); // esim. "ops@converto.fi,founder@converto.fi"

export async function GET() {
  // Hae data Supabasesta: view pilot_signups_stats
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/pilot_signups_stats?select=*`,
    {
      headers: {
        apiKey: process.env.SUPABASE_SERVICE_ROLE!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE}`,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return NextResponse.json({ error: "fetch_failed" }, { status: 500 });

  const rows = await res.json();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const iso = yesterday.toISOString().slice(0, 10);

  const yRows = rows.filter((r: any) => r.signup_date.startsWith(iso));
  const total = yRows.reduce((a: number, r: any) => a + r.total_signups, 0);

  const body = `
Päivittäinen raportti — ${iso}

Yhteensä ${total} uutta ilmoittautumista.

${yRows
  .map(
    (r: any) =>
      `${r.locale.toUpperCase()} — ${r.total_signups} ilmoittautumista (${r.confirmed_count} vahvistettua)`
  )
  .join("\n")}
`;

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `Converto pilot-ilmoittautumiset ${iso}`,
    text: body,
  });

  return NextResponse.json({ ok: true, total });
}
