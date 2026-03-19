import { apiFetch } from "./fetcher";

export interface Board {
  _id: string;
  title: string;
  ownerId: string;
  members?: string[];
  createdAt?: string;
}

export async function getBoards(userId: string) {
  return apiFetch<Board[]>(`/api/boards?ownerId=${userId}`);
}

export async function createBoard(data: {
  title: string;
  ownerId: string;
  members?: string[];
}) {
  return apiFetch<Board>("/api/boards", {
    method: "POST",
    body: JSON.stringify(data),
  });
}