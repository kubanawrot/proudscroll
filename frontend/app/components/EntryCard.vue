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
  <div
    class="absolute inset-0 w-dvw h-dvh flex items-end transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
    :class="{ active }"
  >
    <!-- Background image with blur-up -->
    <div class="absolute inset-0 overflow-hidden">
      <img
        v-if="entry.image_url"
        :src="entry.image_url"
        :alt="entry.title"
        loading="lazy"
        class="w-full h-full object-cover object-center transition-[filter,transform,opacity] duration-700 ease-in-out"
        :class="imageLoaded ? 'blur-0 scale-100 opacity-100' : 'blur-[12px] scale-[1.04] opacity-60'"
        @load="imageLoaded = true"
      />
      <!-- Gradient scrim: heavier on mobile for readability -->
      <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10 md:from-ink/85 md:via-ink/35 md:to-ink/10" />
    </div>

    <!-- Content -->
    <div class="relative z-10 p-6 pb-10 md:px-12 md:py-10 lg:px-14 lg:py-12 w-full md:max-w-2xl lg:max-w-4xl">
      <div class="flex items-center gap-4 mb-4">
        <span class="font-sans text-sm font-medium tracking-[0.15em] uppercase text-amber">{{ formattedYear }}</span>
        <span class="font-sans text-xs tracking-[0.1em] uppercase text-warm-gray opacity-70">{{ categoryLabel[entry.category] ?? entry.category }}</span>
      </div>

      <h1 class="font-serif text-4xl md:text-5xl lg:text-7xl font-normal leading-[1.1] text-cream mb-3 tracking-[-0.01em]">{{ entry.title }}</h1>

      <p v-if="entry.subtitle" class="font-sans text-base md:text-lg font-light text-warm-gray leading-relaxed mb-8 max-w-[42rem]">{{ entry.subtitle }}</p>

      <div class="flex items-center gap-6">
        <!-- Like button -->
        <button
          class="like-btn flex items-center gap-2 font-sans text-sm bg-transparent border-0 p-0 cursor-pointer transition-colors duration-200"
          :class="liked ? 'text-ember cursor-default' : pending ? 'text-warm-gray opacity-60 cursor-default' : 'text-warm-gray'"
          :aria-label="liked ? 'Liked' : 'Like this entry'"
          :disabled="liked || pending"
          @click.stop="handleLike"
        >
          <svg class="w-5 h-5 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              :fill="liked ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
          <span>{{ displayCount.toLocaleString() }}</span>
        </button>

        <!-- Read more button -->
        <button
          class="flex items-center gap-1.5 font-sans text-sm font-medium text-cream bg-transparent border border-cream/25 rounded-full px-5 py-2 cursor-pointer tracking-[0.02em] transition-[background-color,border-color] duration-200 hover:bg-cream/[0.08] hover:border-cream/45"
          @click="emit('openDetail')"
        >
          Read more
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.like-btn:hover:not(:disabled) {
  color: #E05C3A;
}

.like-btn:hover:not(:disabled) svg {
  transform: scale(1.2);
}
</style>
