<script setup lang="ts">
import type { Entry } from '~/stores/navigation'

const props = defineProps<{
  entry: Entry | null
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

function onScrimClick() {
  emit('close')
}

const formattedYear = computed(() => {
  if (!props.entry) return ''
  const y = props.entry.year
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
})

const { t } = useI18n()
const { localize } = useEntryLocale()
const localizedEntry = computed(() => props.entry ? localize(props.entry) : null)

const categoryColors: Record<string, string> = {
  science: 'text-[#7EC8C8] border-[#7EC8C8]',
  medicine: 'text-[#B8D4A8] border-[#B8D4A8]',
  art: 'text-amber border-amber',
  environment: 'text-[#8DC87E] border-[#8DC87E]',
  humanitarian: 'text-ember border-ember',
  curiosity: 'text-warm-gray border-warm-gray',
}

// Close on Escape
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="detail">
      <div
        v-if="open && entry"
        class="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-[4px] flex items-end justify-end md:items-stretch"
        @click.self="onScrimClick"
      >
        <div
          class="detail-panel relative w-full md:w-[420px] max-h-[80dvh] md:max-h-dvh bg-ink border-t border-cream/[0.08] md:border-t-0 md:border-l overflow-y-auto overscroll-contain"
          role="dialog"
          aria-modal="true"
        >
          <!-- Header image strip -->
          <div v-if="entry.image_url" class="relative h-44 md:h-56 overflow-hidden">
            <img :src="entry.image_url" :alt="entry.title" loading="lazy" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-b from-transparent from-[40%] to-ink" />
          </div>

          <!-- Close button -->
          <button
            class="absolute top-3 right-3 md:top-4 md:right-4 z-10 flex items-center justify-center w-8 h-8 bg-ink/70 border border-cream/15 rounded-full text-warm-gray cursor-pointer transition-[background-color,color] duration-200 hover:bg-cream/10 hover:text-cream"
            aria-label="Close"
            @click="emit('close')"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>

          <div class="p-5 pb-10 md:p-8 md:pb-12">
            <!-- Meta -->
            <div class="flex items-center gap-3 mb-4">
              <span class="font-sans text-[0.8rem] font-medium tracking-[0.15em] uppercase text-amber">{{ formattedYear }}</span>
              <span
                v-if="entry.category"
                class="font-sans text-[0.7rem] tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full border opacity-70"
                :class="categoryColors[entry.category]"
              >{{ t(`categories.${entry.category}`, entry.category) }}</span>
            </div>

            <h2 class="font-serif text-2xl md:text-3xl font-normal text-cream leading-[1.15] mb-3">{{ localizedEntry?.title }}</h2>
            <p v-if="localizedEntry?.subtitle" class="font-sans text-base font-light text-warm-gray leading-relaxed">{{ localizedEntry.subtitle }}</p>

            <div class="h-px bg-cream/[0.08] my-6" />

            <!-- Full body -->
            <div class="font-sans text-[0.9375rem] font-light text-[#E8E2D9] leading-[1.75]">
              <p v-if="localizedEntry?.body">{{ localizedEntry.body }}</p>
              <p v-else class="text-warm-gray italic">{{ t('full_story_soon') }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Transitions */
.detail-enter-active,
.detail-leave-active {
  transition: opacity 0.3s ease;
}

.detail-enter-active .detail-panel,
.detail-leave-active .detail-panel {
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.detail-enter-from,
.detail-leave-to {
  opacity: 0;
}

.detail-enter-from .detail-panel,
.detail-leave-to .detail-panel {
  transform: translateY(100%);
}

@media (min-width: 768px) {
  .detail-enter-from .detail-panel,
  .detail-leave-to .detail-panel {
    transform: translateX(100%);
  }
}
</style>
