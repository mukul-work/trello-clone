import { NextResponse } from "next/server"
import { createList, getLists } from "@/services/listService"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const boardId = searchParams.get("boardId")

  const lists = await getLists(boardId as string)

  return NextResponse.json(lists)
}

export async function POST(req: Request) {
  const body = await req.json()

  const list = await createList(body)

  return NextResponse.json(list)
}