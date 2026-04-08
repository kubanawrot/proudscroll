import { createClient } from '@supabase/supabase-js'
import { verifyAdminCookie } from '../../../utils/admin-auth'

export default defineEventHandler(async (event) => {
  if (!verifyAdminCookie(event)) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const allowed = ['status', 'title', 'subtitle', 'summary', 'body', 'image_url', 'year', 'category', 'title_pl', 'subtitle_pl', 'summary_pl', 'body_pl']
  const updates = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  )

  const supabase = createClient(config.supabaseUrl!, config.supabaseServiceKey!)
  const { data, error } = await supabase
    .from('entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})
