<script setup lang="ts">
import { useNavigationStore } from '~/stores/navigation'

const store = useNavigationStore()

const hoveredYear = ref<number | null>(null)

// availableYears is sorted descending (newest first = top of scrubber)
const years = computed(() => store.availableYears)

function formattedYear(y: number) {
  return y < 0 ? `${Math.abs(y)} BC` : `${y}`
}

function navigateTo(year: number) {
  if (year === store.currentYear) return
  const direction: 1 | -1 = year > store.currentYear ? 1 : -1
  store.goToYear(year, direction)
}
</script>

<template>
  <div class="scrubber" role="navigation" aria-label="Year timeline">
    <div class="scrubber-track">
      <div
        v-for="year in years"
        :key="year"
        class="scrubber-item"
        @mouseenter="hoveredYear = year"
        @mouseleave="hoveredYear = null"
        @click="navigateTo(year)"
      >
        <!-- Year label (shows on hover or when active) -->
        <Transition name="label">
          <span
            v-if="hoveredYear === year || store.currentYear === year"
            class="scrubber-label"
            :class="{ active: store.currentYear === year }"
          >
            {{ formattedYear(year) }}
          </span>
        </Transition>

        <!-- Dot -->
        <div
          class="scrubber-dot"
          :class="{
            active: store.currentYear === year,
            hovered: hoveredYear === year && store.currentYear !== year,
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrubber {
  position: fixed;
  right: 1.75rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  display: flex;
  align-items: center;
  /* Hide on very small screens */
  display: none;
}

@media (min-width: 640px) {
  .scrubber {
    display: flex;
  }
}

.scrubber-track {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  max-height: 70dvh;
  overflow: visible;
}

.scrubber-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
}

.scrubber-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(245, 240, 232, 0.2);
  flex-shrink: 0;
  transition: background 0.2s ease, transform 0.2s ease, width 0.2s ease;
}

.scrubber-dot.active {
  background: #D4A853;
  width: 8px;
  height: 8px;
  box-shadow: 0 0 8px rgba(212, 168, 83, 0.5);
}

.scrubber-dot.hovered {
  background: rgba(245, 240, 232, 0.5);
  transform: scale(1.4);
}

.scrubber-label {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: rgba(245, 240, 232, 0.4);
  white-space: nowrap;
  user-select: none;
}

.scrubber-label.active {
  color: #D4A853;
  font-weight: 600;
}

/* Label fade transition */
.label-enter-active,
.label-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.label-enter-from,
.label-leave-to {
  opacity: 0;
  transform: translateX(4px);
}
</style>
