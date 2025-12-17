import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Cart from "@/models/Cart";
import sanitize from "mongo-sanitize";
import { cartItemSchema } from "@/validation/cartSchema";
import { CartItem } from "@/types/cart";

function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No token provided");
  const token = authHeader.replace("Bearer ", "");
  return { id: token };
}

async function getOrCreateCart(userId: string) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}


export async function GET(req: Request) {
  try {
    const user = getUserFromToken(req);
    await dbConnect();
    const cart = await getOrCreateCart(user.id);
    return NextResponse.json(cart.items);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}


export async function POST(req: Request) {
  try {
    const user = getUserFromToken(req);
    const body = sanitize(await req.json());
    const parsed = cartItemSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    await dbConnect();
    const cart = await getOrCreateCart(user.id);
    const existing = cart.items.find((i: CartItem) => i.id === parsed.data.id);
    if (existing) existing.qty += parsed.data.qty;
    else cart.items.push(parsed.data);

    await cart.save();
    return NextResponse.json(cart.items);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}


export async function PATCH(req: Request) {
  try {
    const user = getUserFromToken(req);
    const { id, qty } = sanitize(await req.json());
    if (!id || typeof qty !== "number") return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    await dbConnect();
    const cart = await Cart.findOne({ userId: user.id });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    const item = cart.items.find((i: CartItem) => i.id === id);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    item.qty = qty;
    await cart.save();
    return NextResponse.json(item);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = getUserFromToken(req);
    const { id, clearAll } = sanitize(await req.json());

    await dbConnect();
    const cart = await Cart.findOne({ userId: user.id });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    if (clearAll) cart.items = [];
    else if (id) cart.items = cart.items.filter((i: CartItem) => i.id !== id);
    else return NextResponse.json({ error: "Missing id or clearAll" }, { status: 400 });

    await cart.save();
    return NextResponse.json({ ok: true, items: cart.items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
