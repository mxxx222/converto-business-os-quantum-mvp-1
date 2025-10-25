import { NextResponse } from "next/server";
import { listReceipts } from "@/lib/uploads";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ items: listReceipts() });
}
