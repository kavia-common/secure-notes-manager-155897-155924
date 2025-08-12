<script setup lang="ts">
import { onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Sidebar from '@/components/Sidebar.vue'
import NoteList from '@/components/NoteList.vue'
import NoteEditor from '@/components/NoteEditor.vue'
import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const notes = useNotesStore()

onMounted(() => {
  if (auth.user) {
    notes.load()
  }
})
</script>

<template>
  <div class="app-shell">
    <NavBar />
    <div class="body">
      <Sidebar />
      <NoteList />
      <NoteEditor />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.body {
  display: flex;
  gap: 0;
  min-height: calc(100vh - var(--nav-height));
  background: var(--color-background);
}
@media (max-width: 1024px) {
  .body {
    flex-direction: column;
  }
}
</style>
