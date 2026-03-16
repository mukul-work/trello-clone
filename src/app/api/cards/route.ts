import { NextResponse } from "next/server"
import {
  createCard,
  getCards,
  updateCard,
  deleteCard,
} from "@/services/cardService"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const listId = searchParams.get("listId")

  const cards = await getCards(listId as string)

  return NextResponse.json(cards)
}

export async function POST(req: Request) {
  const body = await req.json()

  const card = await createCard(body)

  return NextResponse.json(card)
}

export async function PATCH(req: Request) {
  const body = await req.json()

  await updateCard(body.id, body)

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)

  const id = searchParams.get("id")

  await deleteCard(id as string)

  return NextResponse.json({ success: true })
}