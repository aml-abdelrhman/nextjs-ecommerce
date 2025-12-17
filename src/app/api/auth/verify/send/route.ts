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

  await Token.create({
    userId: user._id,
    token,
  });

  const verificationLink = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
  });

  return NextResponse.json({ ok: true });
}

