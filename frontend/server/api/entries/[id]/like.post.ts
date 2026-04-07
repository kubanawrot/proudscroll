import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const entryId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const clientId: string = body?.clientId

  if (!entryId || !clientId) {
    throw createError({ statusCode: 400, message: 'entryId and clientId required' })
  }

  const supabase = createClient(config.supabaseUrl!, config.supabaseServiceKey!)

  // Insert like — unique constraint handles duplicates silently
  const { error } = await supabase
    .from('likes')
    .insert({ entry_id: entryId, client_id: clientId })

  // 23505 = unique_violation (already liked — not an error for the client)
  if (error && error.code !== '23505') {
    throw createError({ statusCode: 500, message: error.message })
  }

  const { data } = await supabase
    .from('entries')
    .select('likes_count')
    .eq('id', entryId)
    .single()

  return { likes_count: data?.likes_count ?? 0 }
})
