import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payload = await readBody(event)

  const { year, title, subtitle, summary, body, category, image_url, submitter_email } = payload

  if (!year || !title || !summary) {
    throw createError({ statusCode: 400, message: 'year, title and summary are required' })
  }

  const supabase = createClient(config.supabaseUrl!, config.supabaseServiceKey!)

  const { error } = await supabase.from('entries').insert({
    year: Number(year),
    title,
    subtitle: subtitle || null,
    summary,
    body: body || null,
    category: category || 'curiosity',
    image_url: image_url || null,
    status: 'pending',
  })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
