<script setup lang="ts">
import { useNavigationStore } from '~/stores/navigation'

const store = useNavigationStore()

const years = computed(() => store.availableYears) // descending: newest first
const newestYear = computed(() => years.value[0])
const oldestYear = computed(() => years.value[years.value.length - 1])

// 0 = top (newest), 1 = bottom (oldest)
const progress = computed(() => {
  const idx = years.value.indexOf(store.currentYear)
  if (idx === -1 || years.value.length <= 1) return 0
  return idx / (years.value.length - 1)
})

function formattedYear(y: number) {
  return y < 0 ? `${Math.abs(y)} BC` : `${y}`
}

// Hover state
const hoverProgress = ref<number | null>(null)
const hoverYear = computed(() => {
  if (hoverProgress.value === null || years.value.length === 0) return null
  const idx = Math.round(hoverProgress.value * (years.value.length - 1))
  return years.value[Math.max(0, Math.min(years.value.length - 1, idx))]
})

function onMouseMove(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  hoverProgress.value = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
}

function onMouseLeave() {
  hoverProgress.value = null
}

function onClick(e: MouseEvent) {
  if (hoverYear.value === null || hoverYear.value === store.currentYear) return
  const direction: 1 | -1 = hoverYear.value > store.currentYear ? 1 : -1
  store.goToYear(hoverYear.value, direction)
}
</script>

<template>
  <div
    class="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col items-end select-none"
    style="height: 60dvh"
    role="navigation"
    aria-label="Year timeline"
  >
    <!-- Newest year label -->
    <span class="font-sans text-[0.6rem] tracking-[0.12em] uppercase text-cream/30 mb-3 tabular-nums">
      {{ newestYear !== undefined ? formattedYear(newestYear) : '' }}
    </span>

    <!-- Timeline track -->
    <div
      class="relative flex-1 flex justify-end cursor-pointer group"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
      @click="onClick"
    >
      <!-- Expanded hit area (wider than the visible line) -->
      <div class="absolute inset-y-0 -left-4 right-0" />

      <!-- Background line -->
      <div class="w-px h-full bg-cream/10" />

      <!-- Filled portion (top → current position) -->
      <div
        class="absolute right-0 top-0 w-px bg-cream/25 origin-top transition-[height] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        :style="{ height: `${progress * 100}%` }"
      />

      <!-- Hover ghost indicator -->
      <Transition name="ghost">
        <div
          v-if="hoverProgress !== null && hoverYear !== store.currentYear"
          class="absolute right-[-2.5px] w-1.5 h-1.5 rounded-full bg-cream/30 pointer-events-none flex items-center"
          :style="{ top: `calc(${hoverProgress * 100}% - 3px)` }"
        >
          <span class="absolute right-4 font-sans text-[0.6rem] tracking-wider text-cream/40 whitespace-nowrap tabular-nums">
            {{ hoverYear !== null ? formattedYear(hoverYear) : '' }}
          </span>
        </div>
      </Transition>

      <!-- Current position indicator -->
      <div
        class="absolute right-[-3px] w-2 h-2 rounded-full bg-amber pointer-events-none flex items-center transition-[top] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        :style="{ top: `calc(${progress * 100}% - 4px)` }"
        style="box-shadow: 0 0 8px rgba(212,168,83,0.6)"
      >
        <!-- Current year label -->
        <span class="absolute right-5 font-sans text-[0.65rem] tracking-wider font-medium text-amber whitespace-nowrap tabular-nums">
          {{ formattedYear(store.currentYear) }}
        </span>
      </div>
    </div>

    <!-- Oldest year label -->
    <span class="font-sans text-[0.6rem] tracking-[0.12em] uppercase text-cream/30 mt-3 tabular-nums">
      {{ oldestYear !== undefined ? formattedYear(oldestYear) : '' }}
    </span>
  </div>
</template>

<style scoped>
.ghost-enter-active,
.ghost-leave-active {
  transition: opacity 0.15s ease;
}
.ghost-enter-from,
.ghost-leave-to {
  opacity: 0;
}
</style>
