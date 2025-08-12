import { getJSON, setJSON, remove } from './storage'
import type { User } from '@/types'

const USERS_KEY = 'users'
const SESSION_KEY = 'session_user_id'

// Very simple (not secure) hash for demo purposes only
function hashPassword(pw: string): string {
  return btoa(unescape(encodeURIComponent(pw)))
}

// PUBLIC_INTERFACE
export async function register(email: string, password: string, displayName: string): Promise<User> {
  /** Register a new user into local storage. Throws if email already exists. Returns the created user. */
  const users = getJSON<User[]>(USERS_KEY, [])
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (exists) {
    throw new Error('Email already registered')
  }
  const now = Date.now()
  const user: User = {
    id: crypto.randomUUID(),
    email,
    displayName,
    passwordHash: hashPassword(password),
    createdAt: now,
  }
  users.push(user)
  setJSON(USERS_KEY, users)
  setJSON(SESSION_KEY, user.id)
  return user
}

// PUBLIC_INTERFACE
export async function login(email: string, password: string): Promise<User> {
  /** Login by verifying stored credentials. Sets the session on success and returns the user. */
  const users = getJSON<User[]>(USERS_KEY, [])
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user || user.passwordHash !== hashPassword(password)) {
    throw new Error('Invalid email or password')
  }
  setJSON(SESSION_KEY, user.id)
  return user
}

// PUBLIC_INTERFACE
export async function logout(): Promise<void> {
  /** Clear current session. */
  remove(SESSION_KEY)
}

// PUBLIC_INTERFACE
export async function getCurrentUser(): Promise<User | null> {
  /** Return the current session user if present, otherwise null. */
  const userId = getJSON<string | null>(SESSION_KEY, null)
  if (!userId) return null
  const users = getJSON<User[]>(USERS_KEY, [])
  return users.find(u => u.id === userId) ?? null
}
