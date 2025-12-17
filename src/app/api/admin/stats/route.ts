import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Upload from "@/models/Upload";
import Support from "@/models/Support";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const usersCount = await User.countDocuments();
    const uploadsCount = await Upload.countDocuments();
    const supportCount = await Support.countDocuments();

    return NextResponse.json({
      users: usersCount,
      uploads: uploadsCount,
      support: supportCount,
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
