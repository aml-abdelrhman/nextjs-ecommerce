import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await dbConnect();

    const messages = await Contact.find().sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, messages });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
