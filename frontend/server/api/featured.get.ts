import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.supabaseUrl!, config.supabaseServiceKey!)

  const { data, error } = await supabase
    .from('entries')
    .select('id, image_url')
    .eq('status', 'published')
    .not('image_url', 'is', null)
    .limit(24)

  if (error) throw createError({ statusCode: 500, message: error.message })

  const shuffled = (data ?? []).sort(() => Math.random() - 0.5).slice(0, 8)
  return shuffled
})
