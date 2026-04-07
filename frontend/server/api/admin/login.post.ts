import { makeToken, setAdminCookie } from '../../utils/admin-auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { password } = await readBody(event)

  if (!password || password !== config.adminPassword) {
    throw createError({ statusCode: 401, message: 'Invalid password' })
  }

  const token = makeToken(config.adminPassword!, config.adminSecret!)
  setAdminCookie(event, token)

  return { ok: true }
})
