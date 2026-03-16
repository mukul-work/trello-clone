import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  const client = await clientPromise
  const db = client.db("trello")

  const collections = await db.listCollections().toArray()

  return NextResponse.json({
    success: true,
    collections
  })
}