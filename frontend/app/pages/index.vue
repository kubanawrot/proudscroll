<script setup lang="ts">
import {useNavigationStore} from "~/stores/navigation"
import {useNavigation} from "~/composables/useNavigation"

useHead({
  title: "Proudscroll — Humanity's Greatest Moments",
  meta: [
    {
      name: "description",
      content:
        "An immersive time capsule of humanity's greatest achievements. No negativity — only inspiration."
    }
  ]
})

const store = useNavigationStore()
const {attach, detach} = useNavigation()

const detailOpen = ref(false)
const submitOpen = ref(false)
const prevYear = ref(store.currentYear)
const yearDirection = ref<"up" | "down">("up")

// Slide direction based on year change
watch(
  () => store.currentYear,
  (next, prev) => {
    yearDirection.value = next < prev ? "down" : "up"
    prevYear.value = prev
  }
)

// Scroll hint — shown after initial load, hidden on first navigation
const showHint = ref(false)
let initialLoadDone = false

watch(() => store.currentYear, () => {
  if (initialLoadDone) showHint.value = false
})

onMounted(async () => {
  attach()
  await store.loadAvailableYears()
  const startYear = store.availableYears[0] ?? new Date().getFullYear()
  await store.goToYear(startYear, 1)
  initialLoadDone = true
  showHint.value = true
  setTimeout(() => { showHint.value = false }, 5000)
})

onUnmounted(() => {
  detach()
})

// Lock navigation while the submit modal is open
watch(submitOpen, (open) => {
  if (open) detach()
  else attach()
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
  <div class="fixed inset-0 w-dvw h-dvh overflow-hidden bg-ink">
    <!-- Card stack -->
    <Transition :name="`slide-${yearDirection}`">
      <div
        v-if="!store.isLoading && store.currentEntry"
        :key="store.currentYear"
        class="absolute inset-0"
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
      <div
        v-else-if="store.isLoading"
        :key="'loading'"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div class="w-12 h-12 rounded-full border-2 border-amber/20 border-t-amber animate-spin" />
      </div>

      <!-- Empty year -->
      <div
        v-else
        :key="'empty'"
        class="absolute inset-0 flex flex-col items-center justify-center gap-2"
      >
        <p class="font-serif text-xl md:text-2xl text-cream">
          No stories found for {{ formattedYear }}
        </p>
        <p class="font-sans text-sm text-warm-gray/60">Scroll to explore another year</p>
      </div>
    </Transition>

    <!-- HUD: year indicator -->
    <div
      class="fixed top-4 left-6 md:top-8 2xl:top-12 md:left-12 lg:left-14 z-50 flex items-baseline gap-1.5 pointer-events-none"
    >
      <span class="font-serif text-lg text-cream/90 tracking-[0.02em]">{{ formattedYear }}</span>
      <span
        v-if="store.currentEntry?.year"
        class="font-serif text-lg tracking-[0.15em] uppercase text-amber/90"
      >
        {{ store.currentYear < 0 ? "BC" : "AD" }}
      </span>
    </div>

    <!-- HUD: story dots -->
    <div
      v-if="totalStories > 1"
      class="fixed bottom-10 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2 items-center"
    >
      <button
        v-for="(_, i) in store.entries"
        :key="i"
        class="w-1.5 h-1.5 rounded-full border-0 p-0 cursor-pointer transition-all duration-200"
        :class="i === store.storyIndex ? 'bg-amber scale-[1.3]' : 'bg-cream/25'"
        :aria-label="`Story ${i + 1}`"
        @click="store.goToStory(i)"
      />
    </div>

    <!-- Scroll hint -->
    <Transition name="hint">
      <div
        v-if="showHint"
        class="fixed bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span class="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-cream/30">Scroll to explore</span>
        <svg class="w-4 h-4 text-cream/25 animate-bounce" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 15l7 7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </Transition>

    <!-- Boundary message -->
    <Transition name="boundary">
      <div
        v-if="store.boundary"
        class="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
      >
        <div
          class="text-center px-8 lg:px-10 2xl:px-12 py-6 lg:py-8 2xl:py-10 rounded-2xl bg-ink/70 backdrop-blur-sm"
        >
          <p class="font-serif text-2xl md:text-3xl text-cream/90">
            {{
              store.boundary === "oldest"
                ? "Congrats, you've reachend the beginning of our story"
                : "We can't look into the future. Yet."
            }}
          </p>
          <p class="font-sans text-sm text-warm-gray/60 mt-2 lg:mt-4 2xl:mt-6 tracking-wide">
            {{ store.boundary === "oldest" ? "No older records found" : "No newer entries yet" }}
          </p>
        </div>
      </div>
    </Transition>

    <!-- Year scrubber timeline -->
    <YearScrubber />

    <!-- Contribute button -->
    <button
      class="fixed top-4 md:top-8 2xl:top-12 right-6 md:right-12 lg:right-14 z-50 flex items-center gap-2 lg:gap-2.5 xl:gap-3 font-sans text-sm lg:text-base 2xl:text-lg font-normal tracking-[0.05em] text-cream/60 bg-transparent border border-cream/[0.3] rounded-full px-3.5 lg:px-5 2xl:px-6 py-2 lg:py-2.5 2xl:py-3 cursor-pointer transition-[color,border-color,background] duration-200 hover:text-cream hover:border-cream/50 hover:bg-cream/10"
      aria-label="Submit a story"
      @click="submitOpen = true"
    >
      <svg
        class="w-4 2xl:w-5 h-4 2xl:h-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <span>Contribute</span>
    </button>

    <!-- Submit modal -->
    <SubmitModal v-if="submitOpen" @close="submitOpen = false" />

    <!-- Detail panel -->
    <EntryDetail :entry="store.currentEntry" :open="detailOpen" @close="detailOpen = false" />
  </div>
</template>

<style scoped>
/* Vertical transitions — full viewport slide */
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  transform: translateY(-100%);
}
.slide-up-leave-to {
  transform: translateY(100%);
}
.slide-down-enter-from {
  transform: translateY(100%);
}
.slide-down-leave-to {
  transform: translateY(-100%);
}

/* Scroll hint */
.hint-enter-active { transition: opacity 0.8s ease; }
.hint-leave-active { transition: opacity 0.5s ease; }
.hint-enter-from, .hint-leave-to { opacity: 0; }

/* Boundary message */
.boundary-enter-active {
  transition: opacity 0.3s ease;
}
.boundary-leave-active {
  transition: opacity 0.5s ease;
}
.boundary-enter-from,
.boundary-leave-to {
  opacity: 0;
}

/* Horizontal transition — story change */
.slide-h-enter-active,
.slide-h-leave-active {
  transition:
    transform 0.45s cubic-bezier(0.25, 1, 0.5, 1),
    opacity 0.25s ease;
}
.slide-h-enter-from {
  transform: translateX(6%);
  opacity: 0;
}
.slide-h-leave-to {
  transform: translateX(-6%);
  opacity: 0;
}
</style>
