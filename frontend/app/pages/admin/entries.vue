<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: false })

useHead({ title: 'Admin — Proudscroll' })

type Status = 'all' | 'pending' | 'published' | 'rejected'

interface Entry {
  id: string
  year: number
  title: string
  subtitle: string | null
  summary: string
  body: string | null
  image_url: string | null
  category: string
  status: string
  likes_count: number
  created_at: string
}

const statusFilter = ref<Status>('pending')
const entries = ref<Entry[]>([])
const loading = ref(false)
const editEntry = ref<Entry | null>(null)
const deleteTarget = ref<Entry | null>(null)
const saving = ref(false)
const errorMsg = ref('')

const tabs: { value: Status; label: string }[] = [
  { value: 'pending',   label: 'Pending' },
  { value: 'published', label: 'Published' },
  { value: 'rejected',  label: 'Rejected' },
  { value: 'all',       label: 'All' },
]

const categories = ['science', 'medicine', 'art', 'environment', 'humanitarian', 'curiosity']

async function fetchEntries() {
  loading.value = true
  try {
    entries.value = await $fetch<Entry[]>(`/api/admin/entries?status=${statusFilter.value}`)
  } finally {
    loading.value = false
  }
}

watch(statusFilter, fetchEntries, { immediate: true })

async function setStatus(entry: Entry, status: string) {
  await $fetch(`/api/admin/entries/${entry.id}`, { method: 'PATCH', body: { status } })
  await fetchEntries()
}

async function saveEdit() {
  if (!editEntry.value) return
  saving.value = true
  errorMsg.value = ''
  try {
    await $fetch(`/api/admin/entries/${editEntry.value.id}`, {
      method: 'PATCH',
      body: {
        title: editEntry.value.title,
        subtitle: editEntry.value.subtitle,
        summary: editEntry.value.summary,
        body: editEntry.value.body,
        image_url: editEntry.value.image_url,
        year: editEntry.value.year,
        category: editEntry.value.category,
        status: editEntry.value.status,
      },
    })
    editEntry.value = null
    await fetchEntries()
  } catch (e: any) {
    errorMsg.value = e?.data?.message ?? 'Save failed.'
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  await $fetch(`/api/admin/entries/${deleteTarget.value.id}`, { method: 'DELETE' })
  deleteTarget.value = null
  await fetchEntries()
}

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

function formattedYear(y: number) {
  return y < 0 ? `${Math.abs(y)} BC` : `${y}`
}

function openEdit(entry: Entry) {
  editEntry.value = { ...entry }
}

const pendingCount = computed(() => entries.value.filter(e => e.status === 'pending').length)
</script>

<template>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-logo">✦ <span>Proudscroll</span></div>
      <nav class="sidebar-nav">
        <span class="nav-item active">Entries</span>
      </nav>
      <div class="sidebar-footer">
        <a href="/" target="_blank" class="sidebar-link">← View site</a>
        <button class="sidebar-logout" @click="logout">Log out</button>
      </div>
    </aside>

    <!-- Main -->
    <main class="admin-main">
      <div class="admin-header">
        <h1 class="admin-title">Entries</h1>
        <div class="tab-bar">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="tab"
            :class="{ active: statusFilter === tab.value }"
            @click="statusFilter = tab.value"
          >
            {{ tab.label }}
            <span v-if="tab.value === 'pending' && pendingCount > 0" class="tab-badge">{{ pendingCount }}</span>
          </button>
        </div>
      </div>

      <div v-if="loading" class="admin-loading">Loading…</div>

      <div v-else-if="entries.length === 0" class="admin-empty">
        No entries in this category.
      </div>

      <div v-else class="entries-table-wrap">
        <table class="entries-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Likes</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in entries"
              :key="entry.id"
              :class="{ 'row--pending': entry.status === 'pending' }"
            >
              <td class="col-year">{{ formattedYear(entry.year) }}</td>
              <td class="col-title">
                <div class="entry-title">{{ entry.title }}</div>
                <div class="entry-summary">{{ entry.summary.slice(0, 80) }}…</div>
              </td>
              <td><span class="badge" :class="`badge--${entry.category}`">{{ entry.category }}</span></td>
              <td><span class="status-badge" :class="`status--${entry.status}`">{{ entry.status }}</span></td>
              <td class="col-num">{{ entry.likes_count }}</td>
              <td class="col-date">{{ new Date(entry.created_at).toLocaleDateString() }}</td>
              <td class="col-actions">
                <div class="action-btns">
                  <button v-if="entry.status === 'pending'" class="action-btn action-btn--approve" @click="setStatus(entry, 'published')">Approve</button>
                  <button v-if="entry.status === 'pending'" class="action-btn action-btn--reject"  @click="setStatus(entry, 'rejected')">Reject</button>
                  <button v-if="entry.status === 'published'" class="action-btn action-btn--reject" @click="setStatus(entry, 'rejected')">Unpublish</button>
                  <button v-if="entry.status === 'rejected'" class="action-btn action-btn--approve" @click="setStatus(entry, 'published')">Publish</button>
                  <button class="action-btn action-btn--edit" @click="openEdit(entry)">Edit</button>
                  <button class="action-btn action-btn--delete" @click="deleteTarget = entry">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Edit modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="editEntry" class="modal-overlay" @click.self="editEntry = null">
          <div class="edit-modal">
            <div class="edit-modal-header">
              <h2>Edit entry</h2>
              <button class="close-btn" @click="editEntry = null">✕</button>
            </div>

            <div class="edit-form">
              <div class="ef-row">
                <div class="ef-field ef-field--sm">
                  <label>Year</label>
                  <input v-model.number="editEntry.year" type="number" class="ef-input" />
                </div>
                <div class="ef-field ef-field--sm">
                  <label>Category</label>
                  <select v-model="editEntry.category" class="ef-input ef-select">
                    <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div class="ef-field ef-field--sm">
                  <label>Status</label>
                  <select v-model="editEntry.status" class="ef-input ef-select">
                    <option value="pending">pending</option>
                    <option value="published">published</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>
              </div>

              <div class="ef-field">
                <label>Title</label>
                <input v-model="editEntry.title" type="text" class="ef-input" />
              </div>

              <div class="ef-field">
                <label>Subtitle</label>
                <input v-model="editEntry.subtitle" type="text" class="ef-input" placeholder="optional" />
              </div>

              <div class="ef-field">
                <label>Summary</label>
                <textarea v-model="editEntry.summary" class="ef-input ef-textarea" rows="3" />
              </div>

              <div class="ef-field">
                <label>Full story</label>
                <textarea v-model="editEntry.body" class="ef-input ef-textarea" rows="6" placeholder="optional" />
              </div>

              <div class="ef-field">
                <label>Image URL</label>
                <input v-model="editEntry.image_url" type="url" class="ef-input" placeholder="https://..." />
              </div>

              <p v-if="errorMsg" class="ef-error">{{ errorMsg }}</p>

              <div class="ef-actions">
                <button class="ef-btn ef-btn--ghost" @click="editEntry = null">Cancel</button>
                <button class="ef-btn ef-btn--primary" :disabled="saving" @click="saveEdit">
                  {{ saving ? 'Saving…' : 'Save changes' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete confirm -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
          <div class="confirm-modal">
            <h2>Delete entry?</h2>
            <p>This will permanently remove <strong>{{ deleteTarget.title }}</strong> and all its likes.</p>
            <div class="ef-actions">
              <button class="ef-btn ef-btn--ghost" @click="deleteTarget = null">Cancel</button>
              <button class="ef-btn ef-btn--danger" @click="confirmDelete">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.admin-shell {
  display: flex;
  min-height: 100dvh;
  background: #0C0A08;
  font-family: var(--font-sans);
}

/* Sidebar */
.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: #0F0D0B;
  border-right: 1px solid rgba(245, 240, 232, 0.06);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  gap: 2rem;
}

.sidebar-logo {
  font-size: 1rem;
  font-weight: 500;
  color: #D4A853;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.sidebar-logo span { color: #F5F0E8; font-size: 0.875rem; }

.sidebar-nav { flex: 1; }

.nav-item {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #C9C3B8;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.nav-item.active, .nav-item:hover { background: rgba(245, 240, 232, 0.06); color: #F5F0E8; }

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-link {
  font-size: 0.75rem;
  color: #C9C3B8;
  text-decoration: none;
  padding: 0.3rem 0.5rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}
.sidebar-link:hover { opacity: 1; }

.sidebar-logout {
  font-size: 0.75rem;
  color: #C9C3B8;
  background: none;
  border: 1px solid rgba(245, 240, 232, 0.1);
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.sidebar-logout:hover { border-color: rgba(224, 92, 58, 0.4); color: #E05C3A; }

/* Main */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-header {
  padding: 1.5rem 2rem 0;
  border-bottom: 1px solid rgba(245, 240, 232, 0.06);
}

.admin-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 400;
  color: #F5F0E8;
  margin-bottom: 1.25rem;
}

.tab-bar {
  display: flex;
  gap: 0;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(201, 195, 184, 0.6);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.tab:hover { color: #C9C3B8; }
.tab.active { color: #D4A853; border-bottom-color: #D4A853; }

.tab-badge {
  background: #E05C3A;
  color: white;
  font-size: 0.6rem;
  font-weight: 600;
  border-radius: 100px;
  padding: 0.1rem 0.4rem;
  min-width: 16px;
  text-align: center;
}

.admin-loading, .admin-empty {
  padding: 3rem 2rem;
  color: rgba(201, 195, 184, 0.4);
  font-size: 0.875rem;
}

.entries-table-wrap {
  flex: 1;
  overflow: auto;
  padding: 0 2rem 2rem;
}

.entries-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.8rem;
}

.entries-table th {
  text-align: left;
  color: rgba(201, 195, 184, 0.5);
  font-weight: 500;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgba(245, 240, 232, 0.06);
}

.entries-table td {
  padding: 0.75rem;
  border-bottom: 1px solid rgba(245, 240, 232, 0.04);
  vertical-align: top;
  color: #C9C3B8;
}

.row--pending td { background: rgba(212, 168, 83, 0.03); }

.col-year { font-weight: 500; color: #D4A853; white-space: nowrap; }
.col-num  { color: rgba(201, 195, 184, 0.5); text-align: right; }
.col-date { white-space: nowrap; color: rgba(201, 195, 184, 0.4); font-size: 0.75rem; }

.entry-title { color: #F5F0E8; font-weight: 400; margin-bottom: 0.2rem; }
.entry-summary { color: rgba(201, 195, 184, 0.5); font-size: 0.75rem; line-height: 1.4; }

.badge {
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 100px;
  border: 1px solid currentColor;
  white-space: nowrap;
  opacity: 0.7;
}
.badge--science    { color: #7EC8C8; }
.badge--medicine   { color: #B8D4A8; }
.badge--art        { color: #D4A853; }
.badge--environment { color: #8DC87E; }
.badge--humanitarian { color: #E05C3A; }
.badge--curiosity  { color: #C9C3B8; }

.status-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
  font-weight: 500;
  white-space: nowrap;
}
.status--pending   { background: rgba(212, 168, 83, 0.15); color: #D4A853; }
.status--published { background: rgba(141, 200, 126, 0.15); color: #8DC87E; }
.status--rejected  { background: rgba(201, 195, 184, 0.08); color: rgba(201, 195, 184, 0.4); }

.col-actions { white-space: nowrap; }

.action-btns { display: flex; gap: 0.4rem; flex-wrap: wrap; }

.action-btn {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  white-space: nowrap;
}

.action-btn--approve { background: rgba(141, 200, 126, 0.1); color: #8DC87E; border-color: rgba(141, 200, 126, 0.2); }
.action-btn--approve:hover { background: rgba(141, 200, 126, 0.2); }

.action-btn--reject { background: rgba(201, 195, 184, 0.06); color: rgba(201, 195, 184, 0.5); border-color: rgba(201, 195, 184, 0.1); }
.action-btn--reject:hover { background: rgba(224, 92, 58, 0.1); color: #E05C3A; border-color: rgba(224, 92, 58, 0.2); }

.action-btn--edit { background: rgba(212, 168, 83, 0.08); color: #D4A853; border-color: rgba(212, 168, 83, 0.15); }
.action-btn--edit:hover { background: rgba(212, 168, 83, 0.15); }

.action-btn--delete { background: none; color: rgba(201, 195, 184, 0.3); border-color: transparent; }
.action-btn--delete:hover { color: #E05C3A; }

/* Edit/confirm modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(10, 8, 6, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.edit-modal {
  width: 100%;
  max-width: 640px;
  max-height: 90dvh;
  background: #151210;
  border: 1px solid rgba(245, 240, 232, 0.08);
  border-radius: 14px;
  overflow-y: auto;
}

.edit-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(245, 240, 232, 0.06);
}

.edit-modal-header h2 {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 400;
  color: #F5F0E8;
}

.close-btn {
  background: none;
  border: none;
  color: #C9C3B8;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  transition: color 0.2s;
}
.close-btn:hover { color: #F5F0E8; }

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.ef-row { display: flex; gap: 0.75rem; }

.ef-field { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; }
.ef-field--sm { flex: 0 0 auto; min-width: 100px; }

.ef-field label {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(201, 195, 184, 0.5);
}

.ef-input {
  background: rgba(245, 240, 232, 0.04);
  border: 1px solid rgba(245, 240, 232, 0.1);
  border-radius: 7px;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: #F5F0E8;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.ef-input:focus { border-color: rgba(212, 168, 83, 0.4); }

.ef-select { appearance: none; cursor: pointer; }
.ef-select option { background: #151210; }

.ef-textarea { resize: vertical; min-height: 80px; line-height: 1.6; }

.ef-error {
  font-size: 0.8rem;
  color: #E05C3A;
  padding: 0.6rem 0.75rem;
  background: rgba(224, 92, 58, 0.08);
  border-radius: 6px;
  border: 1px solid rgba(224, 92, 58, 0.2);
}

.ef-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding-top: 0.25rem;
}

.ef-btn {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 7px;
  padding: 0.55rem 1.25rem;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  border: 1px solid transparent;
}

.ef-btn--primary { background: #D4A853; color: #0F0D0B; border-color: #D4A853; }
.ef-btn--primary:hover:not(:disabled) { background: #e0b860; }
.ef-btn--primary:disabled { opacity: 0.4; cursor: not-allowed; }

.ef-btn--ghost { background: none; color: #C9C3B8; border-color: rgba(245, 240, 232, 0.12); }
.ef-btn--ghost:hover { border-color: rgba(245, 240, 232, 0.25); color: #F5F0E8; }

.ef-btn--danger { background: rgba(224, 92, 58, 0.15); color: #E05C3A; border-color: rgba(224, 92, 58, 0.3); }
.ef-btn--danger:hover { background: rgba(224, 92, 58, 0.25); }

.confirm-modal {
  background: #151210;
  border: 1px solid rgba(245, 240, 232, 0.08);
  border-radius: 14px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.confirm-modal h2 {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 400;
  color: #F5F0E8;
}

.confirm-modal p {
  font-size: 0.875rem;
  color: #C9C3B8;
  line-height: 1.6;
}

.confirm-modal strong { color: #F5F0E8; }

/* Modal transitions */
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-active .edit-modal,
.modal-enter-active .confirm-modal,
.modal-leave-active .edit-modal,
.modal-leave-active .confirm-modal { transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .edit-modal,
.modal-enter-from .confirm-modal,
.modal-leave-to .edit-modal,
.modal-leave-to .confirm-modal { transform: translateY(12px); }
</style>
