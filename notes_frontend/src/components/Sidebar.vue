<script setup lang="ts">
import { computed } from 'vue'
import { useNotesStore } from '@/stores/notes'

defineOptions({ name: 'AppSidebar' })

const notes = useNotesStore()

const categoriesWithCounts = computed(() => {
  const map = new Map<string, number>()
  notes.notes.forEach(n => {
    const key = n.category || 'General'
    map.set(key, (map.get(key) || 0) + 1)
  })
  const arr = Array.from(map.entries()).map(([name, count]) => ({ name, count }))
  arr.sort((a, b) => a.name.localeCompare(b.name))
  return [{ name: 'All', count: notes.notes.length }, ...arr]
})
</script>

<template>
  <aside class="sidebar">
    <div class="head">
      <h3 class="title">Categories</h3>
    </div>
    <nav class="cats">
      <button
        v-for="c in categoriesWithCounts"
        :key="c.name"
        class="cat"
        :class="{ active: notes.activeCategory === c.name }"
        @click="notes.setCategory(c.name)"
      >
        <span>{{ c.name }}</span>
        <span class="badge">{{ c.count }}</span>
      </button>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  border-right: 1px solid var(--color-border);
  background: #fcfdff;
  height: calc(100vh - var(--nav-height));
  position: sticky;
  top: var(--nav-height);
  padding: 16px;
  overflow: auto;
}
.head {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 12px;
}
.title {
  font-size: 14px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: .08em;
  font-weight: 800;
}
.cats {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}
.cat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  color: var(--color-secondary);
  transition: all .15s ease;
}
.cat:hover {
  background: var(--color-white);
  border-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}
.cat.active {
  background: linear-gradient(180deg, #ffffff, #f7faff);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79,140,255,.12);
}
.badge {
  background: rgba(79,140,255,.12);
  color: var(--color-primary);
}
@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}
</style>
