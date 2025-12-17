import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import JoinUs from "@/models/JoinUs";
import sanitize from "mongo-sanitize";

export async function POST(req: NextRequest) {
  try {
    const body = sanitize(await req.json());

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "الاسم والبريد الإلكتروني مطلوبان" }, { status: 400 });
    }

    await dbConnect();

    const exists = await JoinUs.findOne({ email: body.email });
    if (exists) {
      return NextResponse.json({ error: "هذا البريد الإلكتروني مسجل بالفعل" }, { status: 409 });
    }

    const joinus = await JoinUs.create({
      name: body.name,
      email: body.email,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true, joinus });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "حدث خطأ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
