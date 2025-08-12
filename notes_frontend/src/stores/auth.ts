import { defineStore } from 'pinia'
import type { User } from '@/types'
import { getCurrentUser, login as loginSvc, logout as logoutSvc, register as registerSvc } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    initialized: false,
    error: '' as string | null
  }),
  actions: {
    // PUBLIC_INTERFACE
    async initFromStorage() {
      /** Initialize auth state from storage/session if present. */
      this.loading = true
      try {
        const u = await getCurrentUser()
        this.user = u
      } finally {
        this.initialized = true
        this.loading = false
      }
    },
    // PUBLIC_INTERFACE
    async login(email: string, password: string) {
      /** Login with email/password, sets the store user or throws error. */
      this.loading = true
      this.error = null
      try {
        const u = await loginSvc(email, password)
        this.user = u
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Login failed'
        this.error = msg
        throw e
      } finally {
        this.loading = false
      }
    },
    // PUBLIC_INTERFACE
    async register(email: string, password: string, displayName: string) {
      /** Register a new user and set the store user. */
      this.loading = true
      this.error = null
      try {
        const u = await registerSvc(email, password, displayName)
        this.user = u
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Registration failed'
        this.error = msg
        throw e
      } finally {
        this.loading = false
      }
    },
    // PUBLIC_INTERFACE
    async logout() {
      /** Logout and clear store user. */
      await logoutSvc()
      this.user = null
    }
  }
})
