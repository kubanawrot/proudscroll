import { useNavigationStore } from '~/stores/navigation'

export function useNavigation() {
  const store = useNavigationStore()

  // Debounce: ignore scroll events while transitioning
  let lastScrollTime = 0
  const SCROLL_COOLDOWN = 700 // ms

  function canNavigate() {
    const now = Date.now()
    if (store.isTransitioning) return false
    if (now - lastScrollTime < SCROLL_COOLDOWN) return false
    lastScrollTime = now
    return true
  }

  function navigateYear(direction: 1 | -1) {
    if (!canNavigate()) return

    // availableYears is sorted descending: [2020, 2016, 1969, 776, ...]
    // direction  1 = scroll down = going older = higher index in array
    // direction -1 = scroll up   = going newer = lower index in array
    const years = store.availableYears
    const currentIdx = years.indexOf(store.currentYear)

    if (direction === 1 && currentIdx >= years.length - 1) {
      store.triggerBoundary('oldest')
      return
    }
    if (direction === -1 && currentIdx <= 0) {
      store.triggerBoundary('newest')
      return
    }

    const targetYear = store.currentYear - direction
    const searchDirection = -direction as 1 | -1
    store.goToYear(targetYear, searchDirection)
  }

  function navigateStory(direction: 1 | -1) {
    if (store.isTransitioning) return
    const next = store.storyIndex + direction
    if (next >= 0 && next < store.entries.length) {
      store.goToStory(next)
    }
  }

  // Wheel handler
  function onWheel(e: WheelEvent) {
    e.preventDefault()
    const absX = Math.abs(e.deltaX)
    const absY = Math.abs(e.deltaY)

    if (absY > absX) {
      // Vertical: change year
      navigateYear(e.deltaY > 0 ? 1 : -1)
    } else {
      // Horizontal: change story
      navigateStory(e.deltaX > 0 ? 1 : -1)
    }
  }

  // Keyboard handler
  function onKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':    e.preventDefault(); navigateYear(-1); break
      case 'ArrowDown':  e.preventDefault(); navigateYear(1);  break
      case 'ArrowLeft':  e.preventDefault(); navigateStory(-1); break
      case 'ArrowRight': e.preventDefault(); navigateStory(1);  break
    }
  }

  // Touch handling
  let touchStartX = 0
  let touchStartY = 0
  const SWIPE_THRESHOLD = 50

  function onTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }

  function onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX
    const dy = e.changedTouches[0].clientY - touchStartY
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) return

    if (absY > absX) {
      navigateYear(dy < 0 ? 1 : -1)
    } else {
      navigateStory(dx < 0 ? 1 : -1)
    }
  }

  function attach() {
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
  }

  function detach() {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
  }

  return { attach, detach, navigateYear, navigateStory }
}
