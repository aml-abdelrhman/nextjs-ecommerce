import jwt from "jsonwebtoken";

export function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) throw new Error("No authorization header");

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { id: string; email: string };
  } catch {
    throw new Error("Invalid token");
  }
}
