import { NextResponse } from "next/server";
import { restoreReceipt } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const meta = restoreReceipt(params.id);
  if (!meta) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, meta });
}
