import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const year = Number(query.year)

  if (!year || isNaN(year)) {
    throw createError({ statusCode: 400, message: 'year query param required' })
  }

  const supabase = createClient(config.supabaseUrl!, config.supabaseServiceKey!)

  const { data, error } = await supabase
    .from('entries')
    .select('id, year, title, subtitle, summary, body, image_url, category, likes_count')
    .eq('year', year)
    .eq('status', 'published')
    .order('likes_count', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return data ?? []
})
