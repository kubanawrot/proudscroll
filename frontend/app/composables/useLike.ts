const CLIENT_ID_KEY = 'proudscroll_client_id'
const LIKED_KEY = 'proudscroll_liked'

function getClientId(): string {
  let id = localStorage.getItem(CLIENT_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(CLIENT_ID_KEY, id)
  }
  return id
}

function getLikedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKED_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function saveLikedSet(set: Set<string>) {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...set]))
}

export function useLike(entryId: Ref<string | undefined>) {
  const liked = ref(false)
  const pending = ref(false)
  const localCount = ref(0)

  watchEffect(() => {
    if (!entryId.value || !import.meta.client) return
    liked.value = getLikedSet().has(entryId.value)
  })

  async function toggleLike(currentCount: number) {
    if (!entryId.value || pending.value || liked.value) return
    pending.value = true

    // Optimistic update
    liked.value = true
    localCount.value = currentCount + 1

    try {
      const clientId = getClientId()
      await $fetch(`/api/entries/${entryId.value}/like`, {
        method: 'POST',
        body: { clientId },
      })
      const set = getLikedSet()
      set.add(entryId.value)
      saveLikedSet(set)
    } catch {
      // Rollback
      liked.value = false
      localCount.value = currentCount
    } finally {
      pending.value = false
    }
  }

  return { liked, pending, localCount, toggleLike }
}
