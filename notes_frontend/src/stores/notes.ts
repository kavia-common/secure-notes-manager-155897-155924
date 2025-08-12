import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Note } from '@/types'
import { createNote, deleteNote, getCategories, getNotes, updateNote } from '@/services/notes.service'
import { useAuthStore } from './auth'

export const useNotesStore = defineStore('notes', () => {
  const auth = useAuthStore()

  const notes = ref<Note[]>([])
  const categories = ref<string[]>([])
  const selectedNoteId = ref<string | null>(null)
  const search = ref('')
  const activeCategory = ref<string>('All')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const selectedNote = computed(() => notes.value.find(n => n.id === selectedNoteId.value) || null)

  const filteredNotes = computed(() => {
    const s = search.value.trim().toLowerCase()
    const cat = activeCategory.value
    return notes.value.filter(n => {
      const matchesCat = cat === 'All' || n.category === cat
      const matchesSearch = !s || n.title.toLowerCase().includes(s) || n.content.toLowerCase().includes(s)
      return matchesCat && matchesSearch
    })
  })

  // PUBLIC_INTERFACE
  async function load() {
    /** Load notes and categories for the current user. */
    if (!auth.user) return
    loading.value = true
    try {
      notes.value = await getNotes(auth.user.id)
      const cats = await getCategories(auth.user.id)
      categories.value = ['All', ...cats.filter(c => c !== 'All')]
      if (!selectedNoteId.value && notes.value.length) {
        selectedNoteId.value = notes.value[0].id
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load notes'
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function addNew(initial?: Partial<Pick<Note, 'title' | 'content' | 'category'>>) {
    /** Create a new note for the current user and select it. */
    if (!auth.user) return
    const n = await createNote(auth.user.id, initial)
    notes.value.unshift(n)
    selectedNoteId.value = n.id
    if (!categories.value.includes(n.category)) {
      categories.value = Array.from(new Set([...categories.value, n.category]))
    }
  }

  // PUBLIC_INTERFACE
  async function save(id: string, updates: Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>) {
    /** Update a note and refresh store state. */
    if (!auth.user) return
    const u = await updateNote(auth.user.id, id, updates)
    const idx = notes.value.findIndex(n => n.id === id)
    if (idx !== -1) notes.value[idx] = u
    // move to top on update
    notes.value = [u, ...notes.value.filter(n => n.id !== id)]
    if (!categories.value.includes(u.category)) {
      categories.value = Array.from(new Set([...categories.value, u.category]))
    }
  }

  // PUBLIC_INTERFACE
  async function remove(id: string) {
    /** Delete a note and update selection. */
    if (!auth.user) return
    await deleteNote(auth.user.id, id)
    const idx = notes.value.findIndex(n => n.id === id)
    const wasSelected = selectedNoteId.value === id
    notes.value.splice(idx, 1)
    if (wasSelected) {
      selectedNoteId.value = notes.value[0]?.id ?? null
    }
  }

  // PUBLIC_INTERFACE
  function setCategory(cat: string) {
    /** Set active category filter. */
    activeCategory.value = cat
  }

  // PUBLIC_INTERFACE
  function setSearch(q: string) {
    /** Set text search filter for notes. */
    search.value = q
  }

  // PUBLIC_INTERFACE
  function selectNote(id: string) {
    /** Select a note by id for editing/viewing. */
    selectedNoteId.value = id
  }

  return {
    notes,
    categories,
    selectedNoteId,
    search,
    activeCategory,
    loading,
    error,
    selectedNote,
    filteredNotes,
    load,
    addNew,
    save,
    remove,
    setCategory,
    setSearch,
    selectNote
  }
})
