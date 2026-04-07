import { createClient } from '@supabase/supabase-js'
import { verifyAdminCookie } from '../../../utils/admin-auth'

export default defineEventHandler(async (event) => {
  if (!verifyAdminCookie(event)) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const supabase = createClient(config.supabaseUrl!, config.supabaseServiceKey!)

  const { error } = await supabase.from('entries').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, message: error.message })

  return { ok: true }
})
