import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json({ user: { id: token.sub, email: token.email, name: token.name, role: token.role } });
}
