import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Token from "@/models/Token";
import User from "@/models/User";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  await dbConnect();
  const dbToken = await Token.findOne({ token });
  if (!dbToken) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

  const user = await User.findById(dbToken.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  await Token.deleteOne({ _id: dbToken._id }); 

  return NextResponse.json({ ok: true });
}
