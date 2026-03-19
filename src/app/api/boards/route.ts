import { NextResponse } from "next/server";
import { createBoard, getBoardsByUser } from "@/services/boardService";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const boards = await getBoardsByUser(session.user.id as string);

  return NextResponse.json(boards);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const board = await createBoard({
    ...body,
    ownerId: session.user.id,
  });

  return NextResponse.json(board);
}