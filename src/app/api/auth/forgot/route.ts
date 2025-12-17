import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Token from "@/models/Token";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email } = await req.json();
  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ ok: true }); 

  const token = crypto.randomBytes(32).toString("hex");
  await Token.create({ userId: user._id, token });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password reset",
    html: `Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.`,
  });

  return NextResponse.json({ ok: true });
}
