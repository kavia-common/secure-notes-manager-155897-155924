<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function submit(e: Event) {
  e.preventDefault()
  loading.value = true
  error.value = null
  try {
    await auth.login(email.value.trim(), password.value)
    const redirect = (route.query.redirect as string) || '/app'
    router.replace(redirect)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth">
    <section class="card panel">
      <div class="brand">
        <span class="dot" />
        <h1>Secure Notes</h1>
      </div>
      <p class="subtitle">Welcome back. Sign in to continue.</p>

      <form class="form" @submit="submit">
        <div>
          <label>Email</label>
          <input class="input" type="email" v-model="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label>Password</label>
          <input class="input" type="password" v-model="password" placeholder="••••••••" required />
        </div>
        <div class="actions">
          <button class="btn" type="submit" :disabled="loading">{{ loading ? 'Signing in...' : 'Sign in' }}</button>
          <RouterLink class="link" to="/register">Create an account</RouterLink>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.auth {
  min-height: 100%;
  display: grid;
  place-items: center;
  background: radial-gradient(1200px 600px at 10% -20%, rgba(79,140,255,0.08), transparent 60%),
              radial-gradient(1000px 500px at 120% 120%, rgba(255,188,66,0.08), transparent 60%),
              #ffffff;
}
.panel {
  width: 100%;
  max-width: 420px;
  padding: 24px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand .dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, var(--color-primary), var(--color-accent));
  box-shadow: 0 0 0 4px rgba(79, 140, 255, .15);
}
.subtitle {
  margin-top: 4px;
  color: var(--color-text-muted);
}
label {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 6px;
}
.error {
  color: #b91c1c;
}
</style>
