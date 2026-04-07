<script setup lang="ts">
import { useNavigationStore } from '~/stores/navigation'
import { useNavigation } from '~/composables/useNavigation'

useHead({
  title: 'Proudscroll — Humanity\'s Greatest Moments',
  meta: [
    { name: 'description', content: 'An immersive time capsule of humanity\'s greatest achievements. No negativity — only inspiration.' },
  ],
})

const store = useNavigationStore()
const { attach, detach } = useNavigation()

const detailOpen = ref(false)
const submitOpen = ref(false)
const prevYear = ref(store.currentYear)
const yearDirection = ref<'up' | 'down'>('up')

// Slide direction based on year change
watch(() => store.currentYear, (next, prev) => {
  yearDirection.value = next < prev ? 'up' : 'down'
  prevYear.value = prev
})

onMounted(async () => {
  attach()
  await store.loadAvailableYears()
  // Start at the most recent year that has content
  const startYear = store.availableYears[0] ?? new Date().getFullYear()
  await store.goToYear(startYear, 1)
})

onUnmounted(() => {
  detach()
})

// Formatted year for HUD
const formattedYear = computed(() => {
  const y = store.currentYear
  return y < 0 ? `${Math.abs(y)} BC` : `${y}`
})

// Story navigation dots
const totalStories = computed(() => store.entries.length)
</script>

<template>
  <div class="canvas">
    <!-- Card stack -->
    <Transition :name="`slide-${yearDirection}`" mode="out-in">
      <div
        v-if="!store.isLoading && store.currentEntry"
        :key="store.currentYear"
        class="card-layer"
      >
        <Transition name="slide-h" mode="out-in">
          <EntryCard
            :key="store.currentEntry.id"
            :entry="store.currentEntry"
            :active="true"
            @open-detail="detailOpen = true"
          />
        </Transition>
      </div>

      <!-- Loading skeleton -->
      <div v-else-if="store.isLoading" :key="'loading'" class="card-layer loading-state">
        <div class="loading-pulse" />
      </div>

      <!-- Empty year -->
      <div v-else :key="'empty'" class="card-layer empty-state">
        <p class="empty-text">No stories found for {{ formattedYear }}</p>
        <p class="empty-hint">Scroll to explore another year</p>
      </div>
    </Transition>

    <!-- HUD: year indicator -->
    <div class="hud-year">
      <span class="hud-year-label">{{ formattedYear }}</span>
      <span v-if="store.currentEntry?.year" class="hud-era">
        {{ store.currentYear < 0 ? 'BC' : 'AD' }}
      </span>
    </div>

    <!-- HUD: story dots -->
    <div v-if="totalStories > 1" class="hud-dots">
      <button
        v-for="(_, i) in store.entries"
        :key="i"
        class="dot"
        :class="{ active: i === store.storyIndex }"
        :aria-label="`Story ${i + 1}`"
        @click="store.goToStory(i)"
      />
    </div>

    <!-- Year scrubber timeline -->
    <YearScrubber />

    <!-- Contribute button -->
    <button class="contribute-btn" aria-label="Submit a story" @click="submitOpen = true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>Contribute</span>
    </button>

    <!-- Submit modal -->
    <SubmitModal v-if="submitOpen" @close="submitOpen = false" />

    <!-- Detail panel -->
    <EntryDetail
      :entry="store.currentEntry"
      :open="detailOpen"
      @close="detailOpen = false"
    />
  </div>
</template>

<style scoped>
.canvas {
  position: fixed;
  inset: 0;
  width: 100dvw;
  height: 100dvh;
  overflow: hidden;
  background: #0F0D0B;
}

.card-layer {
  position: absolute;
  inset: 0;
}

/* Vertical transitions (year change) */
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.55s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease;
}

.slide-up-enter-from  { transform: translateY(-8%); opacity: 0; }
.slide-up-leave-to    { transform: translateY(8%);  opacity: 0; }
.slide-down-enter-from { transform: translateY(8%);  opacity: 0; }
.slide-down-leave-to   { transform: translateY(-8%); opacity: 0; }

/* Horizontal transition (story change) */
.slide-h-enter-active,
.slide-h-leave-active {
  transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease;
}
.slide-h-enter-from { transform: translateX(6%); opacity: 0; }
.slide-h-leave-to   { transform: translateX(-6%); opacity: 0; }

/* Loading state */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-pulse {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(212, 168, 83, 0.2);
  border-top-color: #D4A853;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.empty-text {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: #F5F0E8;
}

.empty-hint {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: #C9C3B8;
  opacity: 0.6;
}

/* HUD: year */
.hud-year {
  position: fixed;
  top: 2rem;
  left: 2.5rem;
  z-index: 50;
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  pointer-events: none;
}

.hud-year-label {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  color: rgba(245, 240, 232, 0.5);
  letter-spacing: 0.02em;
}

.hud-era {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(212, 168, 83, 0.6);
}

/* Contribute button */
.contribute-btn {
  position: fixed;
  top: 1.75rem;
  right: 4rem;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: rgba(245, 240, 232, 0.5);
  background: none;
  border: 1px solid rgba(245, 240, 232, 0.12);
  border-radius: 100px;
  padding: 0.45rem 0.9rem;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.contribute-btn svg {
  width: 0.8rem;
  height: 0.8rem;
}

.contribute-btn:hover {
  color: #F5F0E8;
  border-color: rgba(245, 240, 232, 0.3);
  background: rgba(245, 240, 232, 0.05);
}

/* HUD: story dots */
.hud-dots {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(245, 240, 232, 0.25);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s, transform 0.2s;
}

.dot.active {
  background: #D4A853;
  transform: scale(1.3);
}

</style>
