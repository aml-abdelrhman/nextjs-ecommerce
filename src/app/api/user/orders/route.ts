import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import sanitize from "mongo-sanitize";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized", ok: false }, { status: 401 });

    const body = sanitize(await req.json());

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0 || !body.total || !body.address) {
      return NextResponse.json({ error: "Invalid data", ok: false }, { status: 400 });
    }

    await dbConnect();

    const order = await Order.create({
      userId: session.user.id,
      items: body.items,
      total: body.total,
      address: body.address,
      paymentMethod: body.paymentMethod ?? "card",
      notes: body.notes ?? "",
      status: "processing"
    });

    return NextResponse.json({ ok: true, orderId: order._id.toString() }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message, ok: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized", ok: false }, { status: 401 });

    await dbConnect();
    const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, orders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message, ok: false }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized", ok: false }, { status: 401 });

    await dbConnect();
    const { orderId } = await req.json();

    const order = await Order.findOne({ _id: orderId, userId: session.user.id });
    if (!order) return NextResponse.json({ error: "Order not found", ok: false }, { status: 404 });

    await Order.deleteOne({ _id: orderId });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message, ok: false }, { status: 500 });
  }
}
