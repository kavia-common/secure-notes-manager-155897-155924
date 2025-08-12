import { getJSON, setJSON } from './storage'
import type { Note } from '@/types'

const NOTES_KEY = 'notes'

// PUBLIC_INTERFACE
export async function getNotes(userId: string): Promise<Note[]> {
  /** Get all notes belonging to the given user. */
  const all = getJSON<Note[]>(NOTES_KEY, [])
  return all.filter(n => n.userId === userId).sort((a, b) => b.updatedAt - a.updatedAt)
}

// PUBLIC_INTERFACE
export async function createNote(userId: string, payload?: Partial<Pick<Note, 'title' | 'content' | 'category'>>): Promise<Note> {
  /** Create a new note for the user with optional initial fields; returns the created note. */
  const notes = getJSON<Note[]>(NOTES_KEY, [])
  const now = Date.now()
  const note: Note = {
    id: crypto.randomUUID(),
    userId,
    title: payload?.title?.trim() || 'Untitled',
    content: payload?.content || '',
    category: payload?.category || 'General',
    createdAt: now,
    updatedAt: now,
  }
  notes.push(note)
  setJSON(NOTES_KEY, notes)
  return note
}

// PUBLIC_INTERFACE
export async function updateNote(userId: string, id: string, updates: Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>): Promise<Note> {
  /** Update an existing note for the user; returns the updated note. */
  const notes = getJSON<Note[]>(NOTES_KEY, [])
  const idx = notes.findIndex(n => n.id === id && n.userId === userId)
  if (idx === -1) throw new Error('Note not found')
  const updated: Note = {
    ...notes[idx],
    ...updates,
    updatedAt: Date.now(),
  }
  notes[idx] = updated
  setJSON(NOTES_KEY, notes)
  return updated
}

// PUBLIC_INTERFACE
export async function deleteNote(userId: string, id: string): Promise<void> {
  /** Delete note by id for the user. */
  const notes = getJSON<Note[]>(NOTES_KEY, [])
  const filtered = notes.filter(n => !(n.id === id && n.userId === userId))
  setJSON(NOTES_KEY, filtered)
}

// PUBLIC_INTERFACE
export async function getCategories(userId: string): Promise<string[]> {
  /** Return a list of categories from existing notes for the user. Always includes 'All' and 'General'. */
  const notes = await getNotes(userId)
  const set = new Set<string>(['General'])
  notes.forEach(n => set.add(n.category || 'General'))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}
