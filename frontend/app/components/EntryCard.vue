<script setup lang="ts">
import type {Entry} from "~/stores/navigation"

const props = defineProps<{
  entry: Entry
  active: boolean
}>()

const emit = defineEmits<{
  openDetail: []
}>()

const {t} = useI18n()
const {localize} = useEntryLocale()

const localizedEntry = computed(() => localize(props.entry))

const entryId = computed(() => props.entry.id)
const {liked, pending, localCount, toggleLike} = useLike(entryId)

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
</script>

<template>
  <div
    class="absolute inset-0 w-dvw h-dvh flex items-end transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
    :class="{active}"
  >
    <!-- Background image fade-in (no blur — blur animation is not GPU-composited) -->
    <div class="absolute inset-0 overflow-hidden">
      <img
        v-if="entry.image_url"
        :src="entry.image_url"
        :alt="entry.title"
        :loading="active ? 'eager' : 'lazy'"
        class="w-full h-full object-cover object-center"
      />
      <!-- Gradient scrim: heavier on mobile for readability -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10 md:from-ink/85 md:via-ink/35 md:to-ink/10"
      />
    </div>

    <!-- Content -->
    <div
      class="relative z-10 p-6 pb-10 md:px-12 md:py-10 lg:px-14 lg:py-12 2xl:py-16 w-full md:max-w-2xl lg:max-w-4xl 2xl:max-w-5xl"
    >
      <div class="flex items-center gap-4 mb-4 2xl:mb-6">
        <span
          class="font-sans text-sm 2xl:text-base font-medium tracking-[0.1em] uppercase text-amber"
          >{{ formattedYear }}</span
        >
        <span
          class="font-sans text-sm 2xl:text-base tracking-[0.1em] uppercase text-warm-gray opacity-70"
          >{{ t(`categories.${entry.category}`, entry.category) }}</span
        >
      </div>

      <h1
        class="font-serif text-4xl md:text-5xl lg:text-7xl 2xl:text-8xl font-normal leading-[1.1] text-cream mb-3 lg:mb-5 2xl:mb-8 tracking-[-0.01em]"
      >
        {{ localizedEntry.title }}
      </h1>

      <p
        v-if="localizedEntry.subtitle"
        class="font-sans text-base md:text-lg 2xl:text-xl font-light text-warm-gray leading-relaxed mb-6 md:mb-8 max-w-2xl 2xl:max-w-3xl"
      >
        {{ localizedEntry.subtitle }}
      </p>

      <div class="flex items-center gap-6 lg:gap-8 2xl:gap-10">
        <!-- Like button -->
        <button
          class="like-btn flex items-center gap-2 lg:gap-2.5 2xl:gap-3 font-sans text-sm lg:text-base 2xl:text-lg bg-transparent border-0 p-0 cursor-pointer transition-colors duration-200"
          :class="
            liked
              ? 'text-ember cursor-default'
              : pending
                ? 'text-warm-gray opacity-60 cursor-default'
                : 'text-warm-gray'
          "
          :aria-label="liked ? 'Liked' : 'Like this entry'"
          :disabled="liked || pending"
          @click.stop="handleLike"
        >
          <svg
            class="w-5 lg:w-6 2xl:w-7 h-5 lg:h-6 2xl:h-7 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
          class="flex items-center gap-2 lg:gap-2.5 xl:gap-3 font-sans text-sm lg:text-base 2xl:text-lg font-normal border text-cream/80 bg-black/60 border-cream/50 rounded-full pl-5 lg:pl-6 2xl:pl-7 pr-4 lg:pr-5 2xl:pr-6 py-2 lg:py-2.5 2xl:py-3 cursor-pointer tracking-[0.02em] transition-[background-color,border-color] duration-200 hover:text-cream hover:border-cream/80 hover:bg-black/70"
          @click="emit('openDetail')"
        >
          <span class="-translate-y-px">{{ t("read_more") }}</span>

          <svg
            class="w-5 2xl:w-6 h-5 2xl:h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 17L17 7M17 7H7M17 7v10"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.like-btn:hover:not(:disabled) {
  color: #e05c3a;
}

.like-btn:hover:not(:disabled) svg {
  transform: scale(1.2);
}
</style>
