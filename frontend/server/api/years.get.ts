import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.supabaseUrl!, config.supabaseServiceKey!)

  const { data, error } = await supabase
    .from('entries')
    .select('year')
    .eq('status', 'published')
    .order('year', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })

  // Return unique years as a sorted-descending array
  const years = [...new Set((data ?? []).map((r: { year: number }) => r.year))]
  years.sort((a, b) => b - a)
  return years
})
