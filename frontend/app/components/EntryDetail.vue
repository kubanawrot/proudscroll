<script setup lang="ts">
import type { Entry } from '~/stores/navigation'

const props = defineProps<{
  entry: Entry | null
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

function onScrimClick() {
  emit('close')
}

const formattedYear = computed(() => {
  if (!props.entry) return ''
  const y = props.entry.year
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
})

const categoryColors: Record<string, string> = {
  science: 'badge--science',
  medicine: 'badge--medicine',
  art: 'badge--art',
  environment: 'badge--environment',
  humanitarian: 'badge--humanitarian',
  curiosity: 'badge--curiosity',
}

const categoryLabel: Record<string, string> = {
  science: 'Science',
  medicine: 'Medicine',
  art: 'Art & Culture',
  environment: 'Environment',
  humanitarian: 'Humanitarian',
  curiosity: 'Curiosity',
}

// Close on Escape
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="detail">
      <div v-if="open && entry" class="detail-overlay" @click.self="onScrimClick">
        <div class="detail-panel" role="dialog" aria-modal="true">
          <!-- Header image strip -->
          <div v-if="entry.image_url" class="detail-hero">
            <img :src="entry.image_url" :alt="entry.title" loading="lazy" />
            <div class="detail-hero-scrim" />
          </div>

          <!-- Close button -->
          <button class="detail-close" aria-label="Close" @click="emit('close')">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>

          <div class="detail-body">
            <!-- Meta -->
            <div class="detail-meta">
              <span class="detail-year">{{ formattedYear }}</span>
              <span
                v-if="entry.category"
                class="detail-badge"
                :class="categoryColors[entry.category]"
              >{{ categoryLabel[entry.category] ?? entry.category }}</span>
            </div>

            <h2 class="detail-title">{{ entry.title }}</h2>
            <p v-if="entry.subtitle" class="detail-subtitle">{{ entry.subtitle }}</p>

            <div class="detail-divider" />

            <!-- Full body -->
            <div class="detail-text">
              <p v-if="entry.body">{{ entry.body }}</p>
              <p v-else class="detail-placeholder">Full story coming soon.</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(10, 8, 6, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

/* Desktop: side drawer */
@media (min-width: 768px) {
  .detail-overlay {
    align-items: stretch;
  }
}

.detail-panel {
  position: relative;
  width: 100%;
  max-height: 80dvh;
  background: #0F0D0B;
  border-top: 1px solid rgba(245, 240, 232, 0.08);
  overflow-y: auto;
  overscroll-behavior: contain;
}

@media (min-width: 768px) {
  .detail-panel {
    width: 420px;
    max-height: 100dvh;
    border-top: none;
    border-left: 1px solid rgba(245, 240, 232, 0.08);
  }
}

.detail-hero {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.detail-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, #0F0D0B 100%);
}

.detail-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: rgba(15, 13, 11, 0.7);
  border: 1px solid rgba(245, 240, 232, 0.15);
  border-radius: 50%;
  color: #C9C3B8;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.detail-close:hover {
  background: rgba(245, 240, 232, 0.1);
  color: #F5F0E8;
}

.detail-close svg {
  width: 1rem;
  height: 1rem;
}

.detail-body {
  padding: 1.75rem 2rem 3rem;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-year {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #D4A853;
}

.detail-badge {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
  border: 1px solid currentColor;
  opacity: 0.7;
}

.badge--science    { color: #7EC8C8; }
.badge--medicine   { color: #B8D4A8; }
.badge--art        { color: #D4A853; }
.badge--environment { color: #8DC87E; }
.badge--humanitarian { color: #E05C3A; }
.badge--curiosity  { color: #C9C3B8; }

.detail-title {
  font-family: var(--font-serif);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 400;
  color: #F5F0E8;
  line-height: 1.15;
  margin-bottom: 0.75rem;
}

.detail-subtitle {
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 300;
  color: #C9C3B8;
  line-height: 1.6;
}

.detail-divider {
  height: 1px;
  background: rgba(245, 240, 232, 0.08);
  margin: 1.5rem 0;
}

.detail-text {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 300;
  color: #E8E2D9;
  line-height: 1.75;
}

.detail-placeholder {
  color: #C9C3B8;
  font-style: italic;
}

/* Transitions */
.detail-enter-active,
.detail-leave-active {
  transition: opacity 0.3s ease;
}

.detail-enter-active .detail-panel,
.detail-leave-active .detail-panel {
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.detail-enter-from,
.detail-leave-to {
  opacity: 0;
}

.detail-enter-from .detail-panel,
.detail-leave-to .detail-panel {
  transform: translateY(100%);
}

@media (min-width: 768px) {
  .detail-enter-from .detail-panel,
  .detail-leave-to .detail-panel {
    transform: translateX(100%);
  }
}
</style>
