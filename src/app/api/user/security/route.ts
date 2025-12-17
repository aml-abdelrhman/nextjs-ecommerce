import { NextRequest, NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    await mongooseConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword)
      return NextResponse.json(
        { ok: false, error: "Current and new password are required" },
        { status: 400 }
      );

    if (newPassword.length < 6)
      return NextResponse.json(
        { ok: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );

    const user = await User.findById(session.user.id);
    if (!user || !user.password)
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return NextResponse.json(
        { ok: false, error: "Current password is incorrect" },
        { status: 400 }
      );

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ ok: true, message: "Password updated successfully" });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Server Error" },
      { status: 500 }
    );
  }
}
