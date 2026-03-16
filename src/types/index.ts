export interface User {
  _id?: string
  email: string
  password: string
  name?: string
  createdAt?: Date
}

export interface Board {
  _id?: string
  title: string
  ownerId: string
  members?: string[]
  createdAt?: Date
}

export interface List {
  _id?: string
  boardId: string
  title: string
  order: number
  createdAt?: Date
}

export interface Card {
  _id?: string
  listId: string
  title: string
  description?: string
  order: number
  createdAt?: Date
}