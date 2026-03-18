import { getListCollection } from "@/models/List";
import { List } from "@/types";

export async function createList(data: Omit<List, "_id" | "createdAt">) {
  const lists = await getListCollection();

  const result = await lists.insertOne({
    ...data,
    createdAt: new Date(),
  });

  return result;
}

export async function getLists(boardId: string) {
  const lists = await getListCollection();

  return lists.find({ boardId }).sort({ order: 1 }).toArray();
}
