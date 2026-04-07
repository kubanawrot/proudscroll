<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

const form = reactive({
  year: '',
  isBC: false,
  title: '',
  subtitle: '',
  summary: '',
  body: '',
  image_url: '',
  category: 'science',
  submitter_email: '',
})

const state = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const errorMsg = ref('')

const categories = [
  { value: 'science',       label: 'Science & Technology' },
  { value: 'medicine',      label: 'Medicine & Health' },
  { value: 'art',           label: 'Art & Culture' },
  { value: 'environment',   label: 'Environment' },
  { value: 'humanitarian',  label: 'Humanitarian' },
  { value: 'curiosity',     label: 'Curiosity' },
]

async function submit() {
  if (!form.year || !form.title || !form.summary) return
  state.value = 'submitting'
  errorMsg.value = ''

  try {
    const year = form.isBC ? -Math.abs(Number(form.year)) : Number(form.year)
    await $fetch('/api/submissions', {
      method: 'POST',
      body: {
        year,
        title: form.title,
        subtitle: form.subtitle || null,
        summary: form.summary,
        body: form.body || null,
        image_url: form.image_url || null,
        category: form.category,
        submitter_email: form.submitter_email || null,
      },
    })
    state.value = 'success'
  } catch (e: any) {
    state.value = 'error'
    errorMsg.value = e?.data?.message ?? 'Something went wrong. Please try again.'
  }
}

function reset() {
  Object.assign(form, {
    year: '', isBC: false, title: '', subtitle: '',
    summary: '', body: '', image_url: '', category: 'science', submitter_email: '',
  })
  state.value = 'idle'
  errorMsg.value = ''
}

function close() {
  emit('close')
  setTimeout(reset, 400)
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-overlay" @click.self="close">
        <div class="modal-panel" role="dialog" aria-modal="true" aria-label="Submit a story">

          <button class="modal-close" aria-label="Close" @click="close">
            <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>

          <!-- Success state -->
          <div v-if="state === 'success'" class="success-state">
            <div class="success-icon">✦</div>
            <h2 class="success-title">Thank you for contributing.</h2>
            <p class="success-body">Your story has been submitted for review. If approved, it will appear on Proudscroll for the world to discover.</p>
            <button class="btn-primary" @click="close">Close</button>
          </div>

          <!-- Form state -->
          <template v-else>
            <div class="modal-header">
              <h2 class="modal-title">Share a moment of pride</h2>
              <p class="modal-subtitle">Nominate a discovery, achievement, or milestone that deserves to be remembered. All submissions are reviewed before publishing.</p>
            </div>

            <form class="modal-form" @submit.prevent="submit">
              <!-- Year row -->
              <div class="field-row">
                <div class="field field--narrow">
                  <label class="field-label">Year <span class="required">*</span></label>
                  <input
                    v-model="form.year"
                    type="number"
                    class="field-input"
                    placeholder="e.g. 1969"
                    min="1"
                    required
                  />
                </div>
                <div class="field field--bc">
                  <label class="field-label">&nbsp;</label>
                  <label class="checkbox-label">
                    <input v-model="form.isBC" type="checkbox" class="checkbox" />
                    <span>BC / BCE</span>
                  </label>
                </div>
                <div class="field field--grow">
                  <label class="field-label">Category <span class="required">*</span></label>
                  <select v-model="form.category" class="field-input field-select">
                    <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
                  </select>
                </div>
              </div>

              <!-- Title -->
              <div class="field">
                <label class="field-label">Title <span class="required">*</span></label>
                <input
                  v-model="form.title"
                  type="text"
                  class="field-input"
                  placeholder="e.g. First humans walk on the Moon"
                  maxlength="120"
                  required
                />
              </div>

              <!-- Subtitle -->
              <div class="field">
                <label class="field-label">Subtitle <span class="optional">optional</span></label>
                <input
                  v-model="form.subtitle"
                  type="text"
                  class="field-input"
                  placeholder="A short tagline or context"
                  maxlength="160"
                />
              </div>

              <!-- Summary -->
              <div class="field">
                <label class="field-label">Summary <span class="required">*</span></label>
                <textarea
                  v-model="form.summary"
                  class="field-input field-textarea"
                  placeholder="2–3 sentences shown on the card. What happened, and why does it matter?"
                  rows="3"
                  maxlength="400"
                  required
                />
                <span class="field-hint">{{ form.summary.length }} / 400</span>
              </div>

              <!-- Full story -->
              <div class="field">
                <label class="field-label">Full story <span class="optional">optional</span></label>
                <textarea
                  v-model="form.body"
                  class="field-input field-textarea"
                  placeholder="The deeper story, shown in the detail panel when the reader taps 'Read more'."
                  rows="5"
                />
              </div>

              <!-- Image URL -->
              <div class="field">
                <label class="field-label">Image URL <span class="optional">optional</span></label>
                <input
                  v-model="form.image_url"
                  type="url"
                  class="field-input"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                <span class="field-hint">Direct link to a high-resolution image (min 1600px wide recommended)</span>
              </div>

              <!-- Email -->
              <div class="field">
                <label class="field-label">Your email <span class="optional">optional</span></label>
                <input
                  v-model="form.submitter_email"
                  type="email"
                  class="field-input"
                  placeholder="So we can credit you when it's published"
                />
              </div>

              <!-- Error -->
              <p v-if="state === 'error'" class="error-msg">{{ errorMsg }}</p>

              <div class="modal-actions">
                <button type="button" class="btn-ghost" @click="close">Cancel</button>
                <button
                  type="submit"
                  class="btn-primary"
                  :disabled="state === 'submitting' || !form.year || !form.title || !form.summary"
                >
                  <span v-if="state === 'submitting'">Submitting…</span>
                  <span v-else>Submit for review</span>
                </button>
              </div>
            </form>
          </template>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(10, 8, 6, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-panel {
  position: relative;
  width: 100%;
  max-width: 600px;
  max-height: 90dvh;
  background: #151210;
  border: 1px solid rgba(245, 240, 232, 0.08);
  border-radius: 16px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 2.5rem;
}

.modal-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: rgba(245, 240, 232, 0.05);
  border: 1px solid rgba(245, 240, 232, 0.1);
  border-radius: 50%;
  color: #C9C3B8;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.modal-close:hover { background: rgba(245, 240, 232, 0.1); color: #F5F0E8; }
.modal-close svg { width: 0.875rem; height: 0.875rem; }

.modal-header {
  margin-bottom: 2rem;
  padding-right: 2rem;
}

.modal-title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  font-weight: 400;
  color: #F5F0E8;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.modal-subtitle {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 300;
  color: #C9C3B8;
  line-height: 1.6;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field-row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field--narrow { width: 110px; flex-shrink: 0; }
.field--bc { flex-shrink: 0; }
.field--grow { flex: 1; }

.field-label {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #C9C3B8;
}

.required { color: #D4A853; }
.optional {
  font-weight: 300;
  letter-spacing: 0;
  text-transform: none;
  color: rgba(201, 195, 184, 0.5);
  font-size: 0.65rem;
}

.field-input {
  background: rgba(245, 240, 232, 0.04);
  border: 1px solid rgba(245, 240, 232, 0.1);
  border-radius: 8px;
  padding: 0.6rem 0.875rem;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 300;
  color: #F5F0E8;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.field-input::placeholder { color: rgba(201, 195, 184, 0.35); }
.field-input:focus { border-color: rgba(212, 168, 83, 0.5); }

.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23C9C3B8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2rem;
  cursor: pointer;
}

.field-select option { background: #151210; color: #F5F0E8; }

.field-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.6;
}

.field-hint {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  color: rgba(201, 195, 184, 0.4);
  line-height: 1.4;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 300;
  color: #C9C3B8;
  cursor: pointer;
  padding: 0.6rem 0;
}

.checkbox {
  width: 16px;
  height: 16px;
  accent-color: #D4A853;
  cursor: pointer;
}

.error-msg {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: #E05C3A;
  padding: 0.75rem 1rem;
  background: rgba(224, 92, 58, 0.08);
  border: 1px solid rgba(224, 92, 58, 0.2);
  border-radius: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.btn-primary {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: #0F0D0B;
  background: #D4A853;
  border: none;
  border-radius: 100px;
  padding: 0.65rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}
.btn-primary:hover:not(:disabled) { background: #e0b860; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-ghost {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 400;
  color: #C9C3B8;
  background: none;
  border: 1px solid rgba(245, 240, 232, 0.12);
  border-radius: 100px;
  padding: 0.65rem 1.25rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.btn-ghost:hover { border-color: rgba(245, 240, 232, 0.3); color: #F5F0E8; }

/* Success state */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  gap: 1rem;
}

.success-icon {
  font-size: 2.5rem;
  color: #D4A853;
  line-height: 1;
}

.success-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 400;
  color: #F5F0E8;
}

.success-body {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 300;
  color: #C9C3B8;
  line-height: 1.7;
  max-width: 380px;
}

/* Transition */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active .modal-panel, .modal-leave-active .modal-panel {
  transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-panel, .modal-leave-to .modal-panel {
  transform: translateY(16px);
  opacity: 0;
}
</style>
