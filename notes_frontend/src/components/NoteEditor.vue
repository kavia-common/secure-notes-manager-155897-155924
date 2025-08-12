<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { useNotesStore } from '@/stores/notes'

const notes = useNotesStore()

const note = computed(() => notes.selectedNote)

const title = ref('')
const content = ref('')
const category = ref('General')

// Load fields when note changes
watchEffect(() => {
  if (!note.value) return
  title.value = note.value.title
  content.value = note.value.content
  category.value = note.value.category || 'General'
})

// Debounced save
let timer: number | undefined
function queueSave() {
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    if (!note.value) return
    notes.save(note.value.id, {
      title: title.value,
      content: content.value,
      category: category.value
    })
  }, 400)
}

watch([title, content, category], queueSave)
</script>

<template>
  <section class="editor">
    <div v-if="!note" class="blank card">
      <h3>Select a note to start editing</h3>
      <p class="muted">Choose a note from the list or create a new one.</p>
    </div>

    <div v-else class="content">
      <div class="head">
        <input class="input title" v-model="title" placeholder="Title" />
        <select class="select" v-model="category" title="Category">
          <option value="General">General</option>
          <option
            v-for="c in notes.categories.filter(c => c !== 'All')"
            :key="c"
            :value="c"
          >{{ c }}</option>
        </select>
      </div>
      <textarea class="textarea" v-model="content" placeholder="Write your note here..."></textarea>

      <div class="foot">
        <div class="hint">
          <span class="badge">Autosaving</span>
          <small class="muted">Last updated: {{ new Date(note.updatedAt).toLocaleString() }}</small>
        </div>
        <div class="actions">
          <button class="btn btn-outline" @click="notes.addNew()">New note</button>
          <button class="btn" @click="queueSave()">Save now</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.editor {
  flex: 1;
  height: calc(100vh - var(--nav-height));
  overflow: auto;
  background: linear-gradient(180deg, #ffffff, #f9fbff);
}
.blank {
  margin: 24px;
  padding: 24px;
}
.content {
  max-width: 920px;
  margin: 0 auto;
  padding: 18px 18px 24px;
}
.head {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 10px;
  margin-bottom: 10px;
}
.title {
  font-size: 20px;
  font-weight: 800;
}
.textarea {
  min-height: calc(100vh - var(--nav-height) - 240px);
}
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}
.hint {
  display: flex;
  align-items: center;
  gap: 10px;
}
.muted {
  color: var(--color-gray-600);
}
@media (max-width: 720px) {
  .head {
    grid-template-columns: 1fr;
  }
}
</style>
