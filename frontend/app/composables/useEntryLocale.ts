import type { Entry } from '~/stores/navigation'

export function useEntryLocale() {
  const { locale } = useI18n()

  function localize(entry: Entry): Entry {
    if (locale.value !== 'pl') return entry
    return {
      ...entry,
      title:    entry.title_pl    || entry.title,
      subtitle: entry.subtitle_pl ?? entry.subtitle,
      summary:  entry.summary_pl  || entry.summary,
      body:     entry.body_pl     ?? entry.body,
    }
  }

  return { localize }
}
