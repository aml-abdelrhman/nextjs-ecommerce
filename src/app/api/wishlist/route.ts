"use server";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import sanitize from "mongo-sanitize";
import { z } from "zod";

const wishlistItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  price: z.number().optional(),
  image: z.string().optional(),
});

function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No token provided");
  const token = authHeader.replace("Bearer ", "");
  return { id: token }; 
}

async function getOrCreateWishlist(userId: string) {
  let items = await Wishlist.find({ userId }).sort({ createdAt: -1 });
  if (!items) items = [];
  return items;
}

export async function GET(req: Request) {
  try {
    const user = getUserFromToken(req);
    await dbConnect();

    const items = await getOrCreateWishlist(user.id);

    return NextResponse.json(
      items.map((i) => ({
        _id: i._id.toString(),
        id: i.productId,
        title: i.title,
        price: i.price,
        image: i.image,
      }))
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromToken(req);
    const body = sanitize(await req.json());

    const parsed = wishlistItemSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    await dbConnect();

    const exists = await Wishlist.findOne({
      userId: user.id,
      productId: parsed.data.id,
    });

    if (exists)
      return NextResponse.json({ ok: true, message: "Already in wishlist" });

    await Wishlist.create({
      userId: user.id,
      productId: parsed.data.id,
      title: parsed.data.title,
      price: parsed.data.price || 0,
      image: parsed.data.image || "",
    });

    const items = await getOrCreateWishlist(user.id);

    return NextResponse.json({ ok: true, items });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = getUserFromToken(req);
    const body = sanitize(await req.json());
    const { id, clearAll } = body;

    await dbConnect();

    if (clearAll) {
      await Wishlist.deleteMany({ userId: user.id });
    } else if (id) {
      await Wishlist.deleteOne({ userId: user.id, productId: id });
    } else {
      return NextResponse.json({ error: "Missing id or clearAll" }, { status: 400 });
    }

    const items = await getOrCreateWishlist(user.id);
    return NextResponse.json({ ok: true, items });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}
