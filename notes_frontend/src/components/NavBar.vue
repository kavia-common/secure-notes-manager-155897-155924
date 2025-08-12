<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'

const notes = useNotesStore()
const auth = useAuthStore()

const search = ref(notes.search)
watch(search, (v) => notes.setSearch(v))
</script>

<template>
  <header class="nav">
    <div class="left">
      <div class="brand">
        <span class="dot" />
        <span class="name">Secure Notes</span>
      </div>
      <div class="search">
        <input
          class="input"
          type="search"
          v-model="search"
          placeholder="Search notes..."
          aria-label="Search notes"
        />
      </div>
    </div>
    <div class="right">
      <button class="btn" @click="notes.addNew()">
        + New note
      </button>
      <div class="user">
        <div class="avatar">{{ auth.user?.displayName?.charAt(0).toUpperCase() }}</div>
        <div class="meta">
          <div class="display">{{ auth.user?.displayName }}</div>
          <div class="email">{{ auth.user?.email }}</div>
        </div>
        <button class="btn btn-outline" @click="auth.logout()">Logout</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  height: var(--nav-height);
  background: linear-gradient(180deg, var(--color-white), #fbfdff);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  z-index: 10;
}
.left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  color: var(--color-secondary);
}
.brand .dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, var(--color-primary), var(--color-accent));
  box-shadow: 0 0 0 3px rgba(79, 140, 255, .15);
}
.name { letter-spacing: .3px; }
.search { flex: 1; min-width: 180px; }
.right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
  border-left: 1px solid var(--color-border);
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: var(--color-primary);
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
}
.meta {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.display {
  font-size: 13px;
  color: var(--color-secondary);
  font-weight: 700;
}
.email {
  font-size: 12px;
  color: var(--color-gray-500);
}

@media (max-width: 720px) {
  .email { display: none; }
  .meta { display: none; }
  .search { display: none; }
}
</style>
