import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../entity/User";

interface JwtPayload {
  id: string;
  role: UserRole;
}

/** Verifies the Bearer JWT and attaches user data to the request */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid authorization header" });
    return;
  }

  const token = header.slice(7);
  try {
    const secret = process.env.JWT_SECRET ?? "fallback_secret";
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
