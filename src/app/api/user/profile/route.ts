import { NextRequest, NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await mongooseConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id)
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const user = await User.findById(session.user.id).select("-password");
    if (!user)
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await mongooseConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, phone, avatarBase64 } = await req.json();

    const user = await User.findById(session.user.id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    if (avatarBase64) {
      const uploadResult = await cloudinary.uploader.upload(avatarBase64, {
        folder: "avatars",
      });
      user.avatarUrl = uploadResult.secure_url;
    }

    await user.save();
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Server Error" },
      { status: 500 }
    );
  }
}
