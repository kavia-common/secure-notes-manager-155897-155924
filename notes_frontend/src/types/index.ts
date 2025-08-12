export interface User {
  id: string
  email: string
  displayName: string
  passwordHash: string
  createdAt: number
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  category: string
  createdAt: number
  updatedAt: number
}
