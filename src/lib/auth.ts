import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET as string

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(
  password: string,
  hash: string
) {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}