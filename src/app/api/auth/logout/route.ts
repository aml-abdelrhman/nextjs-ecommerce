import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out successfully" });
  res.cookies.delete("__Secure-next-auth.session-token");
  res.cookies.delete("next-auth.callback-url");
  return res;
}
