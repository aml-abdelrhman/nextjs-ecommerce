import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";
import Wishlist from "@/models/Wishlist";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    await mongooseConnect();

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(
      token.sub,
      "name email avatar"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [ordersCount, wishlistCount, lastOrder] = await Promise.all([
      Order.countDocuments({ userId: user._id }),
      Wishlist.countDocuments({ userId: user._id }),
      Order.findOne({ userId: user._id })
        .sort({ createdAt: -1 })
        .select("total status createdAt"),
    ]);

    return NextResponse.json({
      user,
      stats: {
        ordersCount,
        wishlistCount,
        lastOrder: lastOrder || null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
