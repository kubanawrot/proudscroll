import { defineStore } from 'pinia'

export interface Entry {
  id: string
  year: number
  title: string
  subtitle: string | null
  summary: string
  body: string | null
  image_url: string | null
  category: string
  likes_count: number
  // Polish translations (optional — fall back to English when null)
  title_pl?: string | null
  subtitle_pl?: string | null
  summary_pl?: string | null
  body_pl?: string | null
}

export const useNavigationStore = defineStore('navigation', () => {
  const currentYear = ref(new Date().getFullYear())
  const storyIndex = ref(0)
  const entries = ref<Entry[]>([])
  const isLoading = ref(false)
  const isTransitioning = ref(false)

  // Sorted descending: [2025, 2020, 1969, 1928, ...]
  const availableYears = ref<number[]>([])

  // Cache entries by year to avoid re-fetching
  const cache = new Map<number, Entry[]>()

  async function loadAvailableYears() {
    availableYears.value = await $fetch<number[]>('/api/years')
  }

  async function loadYear(year: number) {
    if (cache.has(year)) return cache.get(year)!
    const data = await $fetch<Entry[]>(`/api/entries?year=${year}`)
    cache.set(year, data)
    prefetchImages(data)
    return data
  }

  function prefetchImages(entries: Entry[]) {
    if (!import.meta.client) return
    entries.forEach(e => {
      if (e.image_url) {
        const img = new Image()
        img.src = e.image_url
      }
    })
  }

  /**
   * Find the nearest year with content relative to `from`,
   * searching in `direction` (-1 = older/smaller year, 1 = newer/larger year).
   * Falls back to the nearest in either direction if none found.
   */
  function nearestYear(from: number, direction: 1 | -1): number | null {
    if (availableYears.value.length === 0) return null

    // availableYears is sorted DESCENDING: [2020, 2016, 1969, 776, ...]
    // direction -1 = going older (smaller year) → want largest y < from → first match in descending array
    // direction  1 = going newer (larger year)  → want smallest y > from → last match in descending array

    const sorted = availableYears.value
    const preferred = sorted.filter(y => direction === -1 ? y < from : y > from)
    if (preferred.length > 0) {
      return direction === -1
        ? preferred[0]                      // largest of y < from (first in desc array)
        : preferred[preferred.length - 1]   // smallest of y > from (last in desc array)
    }

    // Hit a boundary — wrap to the extreme end
    return direction === -1 ? sorted[sorted.length - 1] : sorted[0]
  }

  async function goToYear(year: number, direction: 1 | -1 = -1) {
    if (isTransitioning.value) return
    isTransitioning.value = true
    isLoading.value = true

    // Always jump to the nearest populated year in the intended direction.
    // If the exact year has content, nearestYear will still return it (or the next one).
    let target = year
    if (availableYears.value.length > 0) {
      if (availableYears.value.includes(year)) {
        target = year
      } else {
        target = nearestYear(year, direction) ?? year
      }
    }

    // Load data first — then change the key so the transition shows correct content immediately
    const data = await loadYear(target)
    entries.value = data
    storyIndex.value = 0
    currentYear.value = target
    isLoading.value = false

    // Preload neighbours in available years list
    const idx = availableYears.value.indexOf(target)
    if (idx > 0) loadYear(availableYears.value[idx - 1]).catch(() => {})
    if (idx < availableYears.value.length - 1) loadYear(availableYears.value[idx + 1]).catch(() => {})

    setTimeout(() => { isTransitioning.value = false }, 600)
  }

  function goToStory(index: number) {
    if (index < 0 || index >= entries.value.length) return
    storyIndex.value = index
  }

  const currentEntry = computed(() => entries.value[storyIndex.value] ?? null)

  // Boundary flash message
  const boundary = ref<'oldest' | 'newest' | null>(null)
  let boundaryTimer: ReturnType<typeof setTimeout> | null = null

  function triggerBoundary(type: 'oldest' | 'newest') {
    boundary.value = type
    if (boundaryTimer) clearTimeout(boundaryTimer)
    boundaryTimer = setTimeout(() => { boundary.value = null }, 2500)
  }

  return {
    currentYear,
    storyIndex,
    entries,
    isLoading,
    isTransitioning,
    availableYears,
    currentEntry,
    boundary,
    loadAvailableYears,
    goToYear,
    goToStory,
    triggerBoundary,
  }
})
