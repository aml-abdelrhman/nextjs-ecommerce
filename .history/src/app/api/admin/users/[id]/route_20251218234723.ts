// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// @ts-ignore
export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;

  try {
    await dbConnect();
    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// @ts-ignore
export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;

  try {
    await dbConnect();
    const user = await User.findByIdAndDelete(id);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
