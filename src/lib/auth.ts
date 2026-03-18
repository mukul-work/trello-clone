import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET missing. Set JWT_SECRET in .env.local");
  }
  return secret;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}
