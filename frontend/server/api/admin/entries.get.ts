import { createClient } from '@supabase/supabase-js'
import { verifyAdminCookie } from '../../utils/admin-auth'

export default defineEventHandler(async (event) => {
  if (!verifyAdminCookie(event)) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const config = useRuntimeConfig()
  const query = getQuery(event)
  const supabase = createClient(config.supabaseUrl!, config.supabaseServiceKey!)

  let q = supabase
    .from('entries')
    .select('id, year, title, subtitle, summary, body, image_url, category, status, likes_count, created_at, title_pl, subtitle_pl, summary_pl, body_pl')
    .order('created_at', { ascending: false })

  if (query.status && query.status !== 'all') {
    q = q.eq('status', query.status)
  }

  const { data, error } = await q
  if (error) throw createError({ statusCode: 500, message: error.message })

  return data ?? []
})
