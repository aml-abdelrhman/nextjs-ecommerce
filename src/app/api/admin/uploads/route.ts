import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Upload from "@/models/Upload";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
  const token = await getToken({ req , secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const uploads = await Upload.find().sort({ createdAt: -1 });
  return NextResponse.json({ uploads });
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await dbConnect();
  await Upload.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

