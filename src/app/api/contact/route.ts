import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Contact from "@/models/Contact";
import sanitize from "mongo-sanitize";

export async function POST(req: NextRequest) {
  try {
    const body = sanitize(await req.json());

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    await dbConnect();

    const contact = await Contact.create({
      name: body.name,
      email: body.email,
      message: body.message,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true, contact });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "حدث خطأ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
