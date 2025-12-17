import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, orders });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to load orders" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { orderId, status } = await req.json();
    if (!orderId || !status) return NextResponse.json({ ok: false, error: "Missing data" }, { status: 400 });
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    return NextResponse.json({ ok: true, order });
  } catch {
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ ok: false, error: "Missing orderId" }, { status: 400 });
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Delete failed" }, { status: 500 });
  }
}
