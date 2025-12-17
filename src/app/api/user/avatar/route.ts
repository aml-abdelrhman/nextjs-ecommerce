import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { avatarBase64 } = await req.json();

    if (!avatarBase64) {
      return NextResponse.json({ error: "Missing avatar" }, { status: 400 });
    }

    return NextResponse.json({
      avatarUrl: avatarBase64,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
