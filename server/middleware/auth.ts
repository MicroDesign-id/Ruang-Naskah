import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "ruang-naskah-drama-super-secret-jwt-key-2026";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function generateToken(user: { id: string; name: string; email: string; role: string }): string {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    let token = "";
    
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
    
    // Check cookies if header not present
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(";").map(c => c.trim());
      const authCookie = cookies.find(c => c.startsWith("auth_token="));
      if (authCookie) {
        token = decodeURIComponent(authCookie.split("=")[1]);
      }
    }

    if (!token) {
      res.status(401).json({ error: "Otentikasi diperlukan. Silakan login sebagai admin." });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Verify user in database
    const user = db.query("SELECT id, name, email, role FROM users WHERE id = ?").get(decoded.id) as any;
    if (!user || user.role !== "admin") {
      res.status(403).json({ error: "Akses ditolak. Anda tidak memiliki izin admin." });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Sesi tidak valid atau telah kedaluwarsa. Silakan login kembali." });
  }
}

