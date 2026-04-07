<script setup lang="ts">
import type { Entry } from '~/stores/navigation'

const props = defineProps<{
  entry: Entry
  active: boolean
}>()

const emit = defineEmits<{
  openDetail: []
}>()

const entryId = computed(() => props.entry.id)
const { liked, pending, localCount, toggleLike } = useLike(entryId)

const displayCount = computed(() =>
  localCount.value > 0 ? localCount.value : props.entry.likes_count
)

function handleLike() {
  toggleLike(props.entry.likes_count)
}

const formattedYear = computed(() => {
  const y = props.entry.year
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
})

const categoryLabel: Record<string, string> = {
  science: 'Science',
  medicine: 'Medicine',
  art: 'Art & Culture',
  environment: 'Environment',
  humanitarian: 'Humanitarian',
  curiosity: 'Curiosity',
}

const imageLoaded = ref(false)

// Reset blur state when the entry changes
watch(() => props.entry.id, () => { imageLoaded.value = false })
</script>

<template>
  <div class="entry-card" :class="{ active }">
    <!-- Background image with blur-up -->
    <div class="card-bg">
      <img
        v-if="entry.image_url"
        :src="entry.image_url"
        :alt="entry.title"
        loading="lazy"
        class="card-image"
        :class="{ loaded: imageLoaded }"
        @load="imageLoaded = true"
      />
      <div class="card-scrim" />
    </div>

    <!-- Content -->
    <div class="card-content">
      <div class="card-meta">
        <span class="card-year">{{ formattedYear }}</span>
        <span class="card-category">{{ categoryLabel[entry.category] ?? entry.category }}</span>
      </div>

      <h1 class="card-title">{{ entry.title }}</h1>

      <p v-if="entry.subtitle" class="card-subtitle">{{ entry.subtitle }}</p>

      <div class="card-actions">
        <button
          class="like-btn"
          :class="{ liked, pending }"
          :aria-label="liked ? 'Liked' : 'Like this entry'"
          :disabled="liked || pending"
          @click.stop="handleLike"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              :fill="liked ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
          <span>{{ displayCount.toLocaleString() }}</span>
        </button>

        <button class="read-more-btn" @click="emit('openDetail')">
          Read more
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.entry-card {
  position: absolute;
  inset: 0;
  width: 100dvw;
  height: 100dvh;
  display: flex;
  align-items: flex-end;
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.card-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: blur(12px);
  transform: scale(1.04);
  opacity: 0.6;
  transition: filter 0.7s ease, transform 0.7s ease, opacity 0.5s ease;
}

.card-image.loaded {
  filter: blur(0);
  transform: scale(1);
  opacity: 1;
}

.card-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 8, 6, 0.85) 0%,
    rgba(10, 8, 6, 0.4) 50%,
    rgba(10, 8, 6, 0.1) 100%
  );
}

.card-content {
  position: relative;
  z-index: 10;
  padding: 3rem 3.5rem;
  max-width: 56rem;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-year {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #D4A853;
}

.card-category {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #C9C3B8;
  opacity: 0.7;
}

.card-title {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 400;
  line-height: 1.1;
  color: #F5F0E8;
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
}

.card-subtitle {
  font-family: var(--font-sans);
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  font-weight: 300;
  color: #C9C3B8;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 42rem;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: #C9C3B8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease, transform 0.15s ease;
}

.like-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.like-btn:hover:not(:disabled) {
  color: #E05C3A;
}

.like-btn:hover:not(:disabled) svg {
  transform: scale(1.2);
}

.like-btn.liked {
  color: #E05C3A;
  cursor: default;
}

.like-btn.pending {
  opacity: 0.6;
  cursor: default;
}

.read-more-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: #F5F0E8;
  background: none;
  border: 1px solid rgba(245, 240, 232, 0.25);
  border-radius: 100px;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.read-more-btn svg {
  width: 0.875rem;
  height: 0.875rem;
}

.read-more-btn:hover {
  background: rgba(245, 240, 232, 0.08);
  border-color: rgba(245, 240, 232, 0.45);
}
</style>
