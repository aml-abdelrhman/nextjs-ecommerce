import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import sanitize from "mongo-sanitize";

function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No token provided");
  const token = authHeader.replace("Bearer ", "");
  return { id: token };
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromToken(req);
    const productId = sanitize(params.id);
    if (!productId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await dbConnect();
    const deleted = await Wishlist.findOneAndDelete({
      userId: user.id,
      productId,
    });
    if (!deleted) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    return NextResponse.json({ ok: true, id: productId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
