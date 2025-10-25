import { NextResponse } from "next/server";
import { removeReceipt } from "@/lib/uploads";

export const runtime = "nodejs";

export async function DELETE(_: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const meta = await removeReceipt(params.id);
  if (!meta) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, meta });
}
