import { ObjectId } from "mongodb";
import { getBoardCollection } from "@/models/Board";
import { Board } from "@/types";

export async function createBoard(data: Board) {
  const boards = await getBoardCollection();

  const boardData: Omit<Board, "_id" | "createdAt"> = {
    title: data.title,
    ownerId: data.ownerId,
    members: data.members,
  };
  const createdAt = new Date();

  const result = await boards.insertOne({
    ...boardData,
    createdAt,
  });

  return { ...boardData, createdAt, _id: result.insertedId.toString() };
}

export async function getBoardsByUser(userId: string) {
  const boards = await getBoardCollection();

  return boards.find({ ownerId: userId }).sort({ createdAt: -1 }).toArray();
}

// export async function deleteBoard(boardId: string) {
//   const boards = await getBoardCollection();

//   return boards.deleteOne({ _id: new ObjectId(boardId) });
// }
