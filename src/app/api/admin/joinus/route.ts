import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import sanitize from "mongo-sanitize";
import JoinUs from "@/models/JoinUs";

export async function POST(req: NextRequest) {
  try {
    const body = sanitize(await req.json());

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    await dbConnect();

    const joinUsEntry = await JoinUs.create({
      name: body.name,
      email: body.email,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true, joinUsEntry });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "حدث خطأ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const entries = await JoinUs.find().sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, entries });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
