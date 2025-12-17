// app/api/user/address/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import Address from "@/models/Address";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await mongooseConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id)
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const addresses = await Address.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json({ ok: true, addresses });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await mongooseConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const { fullName, phone, street, city } = await req.json();
    if (!fullName || !phone || !street || !city)
      return NextResponse.json({ ok: false, error: "All fields are required" }, { status: 400 });

    const address = await Address.create({ userId: session.user.id, fullName, phone, street, city });
    return NextResponse.json({ ok: true, address }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await mongooseConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const { addressId, fullName, phone, street, city } = await req.json();
    if (!addressId || !fullName || !phone || !street || !city)
      return NextResponse.json({ ok: false, error: "All fields are required" }, { status: 400 });

     const address = await Address.findOneAndUpdate(
      { _id: addressId, userId: session.user.id },
      { fullName, phone, street, city },
      { new: true }
    );

    if (!address) return NextResponse.json({ ok: false, error: "Address not found" }, { status: 404 });
    return NextResponse.json({ ok: true, address });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await mongooseConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const { addressId } = await req.json();
    if (!addressId) return NextResponse.json({ ok: false, error: "Address ID is required" }, { status: 400 });

    const deleted = await Address.deleteOne({ _id: addressId, userId: session.user.id });
    if (deleted.deletedCount === 0) return NextResponse.json({ ok: false, error: "Address not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}
