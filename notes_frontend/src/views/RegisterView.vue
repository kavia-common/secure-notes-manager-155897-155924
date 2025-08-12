<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const displayName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const auth = useAuthStore()
const router = useRouter()

async function submit(e: Event) {
  e.preventDefault()
  loading.value = true
  error.value = null
  try {
    await auth.register(email.value.trim(), password.value, displayName.value.trim() || 'User')
    router.replace('/app')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Registration failed'
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
        <h1>Create account</h1>
      </div>
      <p class="subtitle">Start managing your notes securely.</p>

      <form class="form" @submit="submit">
        <div>
          <label>Display name</label>
          <input class="input" type="text" v-model="displayName" placeholder="Jane Doe" />
        </div>
        <div>
          <label>Email</label>
          <input class="input" type="email" v-model="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label>Password</label>
          <input class="input" type="password" v-model="password" placeholder="••••••••" required />
        </div>
        <div class="actions">
          <button class="btn" type="submit" :disabled="loading">{{ loading ? 'Creating...' : 'Create account' }}</button>
          <RouterLink class="link" to="/login">I already have an account</RouterLink>
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
  max-width: 480px;
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
