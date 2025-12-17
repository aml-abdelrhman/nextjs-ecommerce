import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import sanitize from "mongo-sanitize";

function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No token provided");
  const token = authHeader.replace("Bearer ", "");
  return { id: token };
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromToken(req);
    const { id } = params;
    const body = sanitize(await req.json());
    if (!body.status || !["Processing", "Shipped", "Completed", "Cancelled"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await dbConnect();
    const order = await Order.findOne({ _id: id, userId: user.id });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    order.status = body.status;
    await order.save();
    return NextResponse.json({ id: order._id.toString(), status: order.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromToken(req);
    const { id } = params;

    await dbConnect();
    const order = await Order.findOne({ _id: id, userId: user.id });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    await order.remove();
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
