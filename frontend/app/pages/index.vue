<script setup lang="ts">
import {useNavigationStore} from "~/stores/navigation"
import {useNavigation} from "~/composables/useNavigation"

const {t, locale, setLocale} = useI18n()

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
const route = useRoute()

// Preload active entry image at highest browser priority
useHead(
  computed(() => ({
    link: store.currentEntry?.image_url
      ? [{rel: "preload", as: "image", href: store.currentEntry.image_url}]
      : []
  }))
)

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

// Landing screen — shown on first load, dismissed on first scroll/touch
const showLanding = ref(true)
const featuredImages = ref<string[]>([])

onMounted(async () => {
  // Load featured images and years in parallel
  const [featured] = await Promise.all([
    $fetch<{image_url: string}[]>("/api/featured"),
    store.loadAvailableYears()
  ])
  featuredImages.value = featured.map((d) => d.image_url)

  const urlYear = route.query.year ? Number(route.query.year) : null
  const startYear = urlYear ?? store.availableYears[0] ?? new Date().getFullYear()
  const direction: 1 | -1 = urlYear && urlYear < (store.availableYears[0] ?? 0) ? -1 : 1
  await store.goToYear(startYear, direction)

  // attach() is called here — navigation starts only after landing is dismissed
  const dismissLanding = () => {
    showLanding.value = false
    setTimeout(attach, 0)
  }
  document.addEventListener("wheel", dismissLanding, {once: true, passive: true})
  document.addEventListener(
    "touchstart",
    () => {
      showLanding.value = false
      document.addEventListener("touchend", () => setTimeout(attach, 0), {
        once: true,
        passive: true
      })
    },
    {once: true, passive: true}
  )
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
  return `${Math.abs(y)}`
})

// Sync URL with current year
watch(
  () => store.currentYear,
  (year) => {
    history.replaceState(null, "", `?year=${year}`)
  }
)

// Surprise me — jump to a random available year
function surpriseMe() {
  const candidates = store.availableYears.filter((y) => y !== store.currentYear)
  if (!candidates.length) return
  const random = candidates[Math.floor(Math.random() * candidates.length)]
  store.goToYear(random, random > store.currentYear ? 1 : -1)
}

// Story navigation dots
const totalStories = computed(() => store.entries.length)

function storyDotActive(dotIndex: number): boolean {
  if (totalStories.value <= 3) return dotIndex === store.storyIndex
  // 4+ stories: window of 3, active is always middle dot
  return dotIndex === 1
}

function storyDotClick(dotIndex: number) {
  if (totalStories.value <= 3) {
    store.goToStory(dotIndex)
  } else {
    if (dotIndex === 0) store.goToStory(store.storyIndex - 1)
    if (dotIndex === 2) store.goToStory(store.storyIndex + 1)
  }
}
</script>

<template>
  <div class="fixed inset-0 w-dvw h-dvh overflow-hidden bg-ink">
    <!-- Card stack -->
    <Transition :name="`slide-${yearDirection}`">
      <div v-if="store.currentEntry" :key="store.currentYear" class="absolute inset-0">
        <Transition :name="store.isTransitioning ? '' : 'slide-h'" mode="out-in">
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
          {{ t("no_stories", {year: formattedYear}) }}
        </p>
        <p class="font-sans text-sm text-warm-gray/60">{{ t("scroll_another") }}</p>
      </div>
    </Transition>

    <!-- HUD: year indicator -->
    <div
      class="fixed top-6 left-6 md:top-9 2xl:top-14 md:left-12 lg:left-14 z-50 flex items-baseline gap-1.5 pointer-events-none"
    >
      <span class="font-serif text-lg text-cream/90 tracking-[0.02em]">{{ formattedYear }}</span>
      <span
        v-if="store.currentEntry?.year"
        class="font-serif text-lg tracking-[0.02em] uppercase text-amber/90"
      >
        {{ store.currentYear < 0 ? "BC" : "AD" }}
      </span>
    </div>

    <!-- HUD: story dots (max 3, always rendered — active dot expands into pill) -->
    <Transition name="story-arrow">
      <div
        v-if="totalStories > 1"
        class="fixed right-6 md:right-10 bottom-14 md:bottom-16 z-50 flex items-center gap-2"
      >
        <button
          v-for="i in Math.min(totalStories, 3)"
          :key="i"
          class="h-1.5 rounded-full border-0 p-0 transition-all duration-300 ease-out"
          :class="
            storyDotActive(i - 1)
              ? 'w-4 bg-cream/90 cursor-default'
              : 'w-1.5 bg-cream/35 hover:bg-cream/60 cursor-pointer'
          "
          :aria-label="`Story ${i}`"
          @click="storyDotClick(i - 1)"
        />
      </div>
    </Transition>

    <!-- Landing screen -->
    <Transition name="landing">
      <div
        v-if="showLanding"
        class="fixed inset-0 z-60 flex flex-col items-center justify-center bg-ink pointer-events-none"
      >
        <!-- Background image grid -->
        <div
          v-if="featuredImages.length"
          class="absolute inset-0 grid grid-cols-2 md:grid-cols-4 grid-rows-4 md:grid-rows-2"
        >
          <div v-for="img in featuredImages" :key="img" class="overflow-hidden">
            <img
              :src="img"
              class="w-full h-full object-cover brightness-[0.15]"
              loading="eager"
              draggable="false"
            />
          </div>
        </div>

        <!-- Text content -->
        <h1
          class="relative z-10 font-serif text-4xl md:text-6xl 2xl:text-7xl text-cream text-center px-8 leading-tight mb-6 lg:mb-10 2xl:mb-14"
        >
          {{ t("landing_title") }}
        </h1>
        <p
          class="relative z-10 font-serif text-lg md:text-xl 2xl:text-2xl text-warm-gray/70 text-center px-8 max-w-xl leading-relaxed font-light"
        >
          {{ t("landing_subtitle") }}
        </p>
        <div
          class="z-10 flex flex-col items-center gap-2 lg:gap-4 2xl:gap-5 mt-4 absolute left-1/2 -translate-x-1/2 bottom-24 lg:top-3/4"
        >
          <span class="font-sans text-xs 2xl:text-sm tracking-[0.25em] uppercase text-cream/40">{{
            t("landing_hint")
          }}</span>
          <svg
            class="w-5 h-5 2xl:w-6 2xl:h-6 text-cream/30 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 5v14M5 15l7 7 7-7"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="absolute bottom-4 z-10 right-4 w-fit">
          <p class="text-[10px] text-cream/25 leading-[1.1] text-right">
            proudly created by <br /><a href="https://www.kubanawrot.com" class="text-cream/35"
              >kubanawrot.com</a
            >
          </p>
        </div>
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
            {{ store.boundary === "oldest" ? t("boundary_oldest") : t("boundary_newest") }}
          </p>
          <p class="font-sans text-sm text-warm-gray/60 mt-2 lg:mt-4 2xl:mt-6 tracking-wide">
            {{ store.boundary === "oldest" ? t("no_older") : t("no_newer") }}
          </p>
        </div>
      </div>
    </Transition>

    <!-- Year scrubber timeline -->
    <YearScrubber />

    <!-- Top-right controls -->
    <div
      class="fixed top-4 md:top-8 2xl:top-12 right-6 md:right-12 lg:right-14 z-50 flex items-center gap-2 md:gap-3"
    >
      <!-- Surprise me button -->
      <button
        v-if="!showLanding"
        class="font-sans text-cream/80 bg-black/60 border-cream/50 border rounded-full p-2.5 lg:p-3 2xl:p-4 cursor-pointer transition-[color,border-color,background] duration-200 hover:text-cream hover:border-cream/80 hover:bg-black/70"
        :aria-label="t('surprise')"
        :title="t('surprise')"
        @click="surpriseMe"
      >
        <svg
          class="w-4 lg:w-5 2xl:w-5 h-4 lg:h-5 2xl:h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="3"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
          <circle cx="15.5" cy="8.5" r="1" fill="currentColor" />
          <circle cx="8.5" cy="15.5" r="1" fill="currentColor" />
          <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      </button>

      <!-- Language toggle -->
      <button
        class="font-sans text-sm lg:text-base 2xl:text-lg font-medium tracking-[0.1em] uppercase text-cream/80 bg-black/60 border-cream/50 border rounded-full px-3.5 lg:px-5 2xl:px-6 py-2 lg:py-2.5 2xl:py-3 cursor-pointer transition-[color,border-color,background] duration-200 hover:text-cream hover:border-cream/80 hover:bg-black/70"
        :aria-label="locale === 'en' ? 'Switch to Polish' : 'Switch to English'"
        @click="setLocale(locale === 'en' ? 'pl' : 'en')"
      >
        {{ locale === "en" ? "PL" : "EN" }}
      </button>

      <!-- Contribute button -->
      <button
        class="flex items-center gap-2 lg:gap-2.5 xl:gap-3 font-sans text-sm lg:text-base 2xl:text-lg font-normal tracking-[0.05em] text-cream/80 bg-black/60 border-cream/50 border rounded-full px-3 lg:px-5 2xl:px-6 py-2.5 lg:py-2.5 2xl:py-3 cursor-pointer transition-[color,border-color,background] duration-200 hover:text-cream hover:border-cream/80 hover:bg-black/70"
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
        <span class="hidden lg:inline-block">{{ t("contribute") }}</span>
      </button>
    </div>

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
  will-change: transform;
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

/* Next story arrow */
.story-arrow-enter-active,
.story-arrow-leave-active {
  transition: opacity 0.3s ease;
}
.story-arrow-enter-from,
.story-arrow-leave-to {
  opacity: 0;
}

/* Landing screen */
.landing-enter-active {
  transition: opacity 0.8s ease;
}
.landing-leave-active {
  transition: opacity 0.6s ease;
}
.landing-enter-from,
.landing-leave-to {
  opacity: 0;
}

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
