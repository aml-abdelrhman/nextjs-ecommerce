import jwt from "jsonwebtoken";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "supersecretkey";

export type AdminUser = {
  id: string;
  email?: string;
};

export function getAdminFromToken(req: Request): AdminUser {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No token provided");

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, ADMIN_SECRET) as AdminUser;
    if (!decoded || !decoded.id) throw new Error("Invalid token");
    return decoded;
  } catch {
    throw new Error("Unauthorized: Invalid or expired token");
  }
}

export function generateAdminToken(admin: AdminUser): string {
  return jwt.sign(admin, ADMIN_SECRET, { expiresIn: "8h" });
}
