<script setup lang="ts">
import { useNotesStore } from '@/stores/notes'
import { computed } from 'vue'

const notes = useNotesStore()

const items = computed(() => notes.filteredNotes)
</script>

<template>
  <section class="list-panel">
    <div class="list-head">
      <h3 class="underline-accent">Your notes</h3>
      <button class="btn btn-outline" @click="notes.addNew()">New</button>
    </div>
    <div class="items">
      <button
        v-for="n in items"
        :key="n.id"
        class="item"
        :class="{ active: notes.selectedNoteId === n.id }"
        @click="notes.selectNote(n.id)"
      >
        <div class="item-top">
          <h4 class="title">{{ n.title || 'Untitled' }}</h4>
          <div class="time">{{ new Date(n.updatedAt).toLocaleString() }}</div>
        </div>
        <div class="meta">
          <span class="badge">{{ n.category || 'General' }}</span>
        </div>
        <p class="excerpt">{{ n.content?.slice(0, 120) || 'No content yet...' }}</p>
        <div class="actions" @click.stop>
          <button class="link" @click="notes.remove(n.id)">Delete</button>
        </div>
      </button>
      <div v-if="!items.length" class="empty card">
        <p>No notes found. Create your first note!</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.list-panel {
  width: 360px;
  border-right: 1px solid var(--color-border);
  height: calc(100vh - var(--nav-height));
  position: sticky;
  top: var(--nav-height);
  overflow: auto;
  background: var(--color-white);
}
.list-head {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 12px;
  background: linear-gradient(180deg, #ffffff, #f8fbff);
  border-bottom: 1px solid var(--color-border);
  z-index: 1;
}
.items {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item {
  text-align: left;
  display: block;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  background: var(--color-surface);
  cursor: pointer;
  transition: all .15s ease;
}
.item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
.item.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79,140,255,.12);
}
.item-top {
  display: flex;
  gap: 8px;
  align-items: baseline;
  justify-content: space-between;
}
.title {
  font-size: 14px;
  font-weight: 800;
  color: var(--color-secondary);
}
.time {
  font-size: 11px;
  color: var(--color-gray-500);
}
.meta {
  margin-top: 6px;
}
.excerpt {
  margin-top: 8px;
  color: var(--color-gray-600);
  font-size: 13px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
.empty {
  padding: 18px;
  text-align: center;
  color: var(--color-gray-600);
}
@media (max-width: 1024px) {
  .list-panel {
    width: 100%;
    height: auto;
    position: relative;
  }
}
</style>
