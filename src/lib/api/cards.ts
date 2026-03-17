import { apiFetch } from "./fetcher"

export interface Card {
  _id: string
  listId: string
  title: string
  description?: string
  order: number
  createdAt?: string
}

export async function getCards(listId: string) {
  return apiFetch<Card[]>(`/api/cards?listId=${listId}`)
}

export async function createCard(data: {
  listId: string
  title: string
  description?: string
  order: number
}) {
  return apiFetch("/api/cards", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export async function updateCard(data: {
  id: string
  title?: string
  description?: string
  order?: number
  listId?: string
}) {
  return apiFetch("/api/cards", {
    method: "PATCH",
    body: JSON.stringify(data)
  })
}

export async function deleteCard(id: string) {
  return apiFetch(`/api/cards?id=${id}`, {
    method: "DELETE"
  })
}