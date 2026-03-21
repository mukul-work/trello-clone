import { NextResponse } from "next/server";
import { createList, getLists } from "@/services/listService";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getListCollection } from "@/models/List";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const boardId = searchParams.get("boardId");

  const lists = await getLists(boardId as string);

  return NextResponse.json(lists);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const list = await createList(body);

  return NextResponse.json(list);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const lists = await getListCollection();
  await lists.deleteOne({ _id: new ObjectId(id as string) });

  return NextResponse.json({ success: true });
}