import { apiFetch } from "./fetcher"

export interface List {
  _id: string
  boardId: string
  title: string
  order: number
  createdAt?: string
}

export async function getLists(boardId: string) {
  return apiFetch<List[]>(`/api/lists?boardId=${boardId}`)
}

export async function createList(data: {
  boardId: string
  title: string
  order: number
}) {
  return apiFetch("/api/lists", {
    method: "POST",
    body: JSON.stringify(data)
  })
}