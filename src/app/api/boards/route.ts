import { NextResponse } from "next/server"
import { createBoard, getBoardsByUser } from "@/services/boardService"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const userId = searchParams.get("userId")

  const boards = await getBoardsByUser(userId as string)

  return NextResponse.json(boards)
}

export async function POST(req: Request) {
  const body = await req.json()

  const board = await createBoard(body)

  return NextResponse.json(board)
}