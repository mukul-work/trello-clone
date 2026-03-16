import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  const client = await clientPromise

  const db = client.db()

  const collections = await db.collections()

  return NextResponse.json({
    message: "MongoDB connected",
    collections: collections.length,
  })
}