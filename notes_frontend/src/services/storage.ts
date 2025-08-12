const NAMESPACE = 'secure-notes-app'

const nsKey = (key: string) => `${NAMESPACE}:${key}`

// PUBLIC_INTERFACE
export function getJSON<T>(key: string, fallback: T): T {
  /** Get a JSON value from localStorage within the app namespace. Returns fallback if missing or invalid. */
  try {
    const raw = localStorage.getItem(nsKey(key))
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

// PUBLIC_INTERFACE
export function setJSON<T>(key: string, value: T): void {
  /** Set a JSON value to localStorage within the app namespace. */
  localStorage.setItem(nsKey(key), JSON.stringify(value))
}

// PUBLIC_INTERFACE
export function remove(key: string): void {
  /** Remove a key from localStorage within the app namespace. */
  localStorage.removeItem(nsKey(key))
}
