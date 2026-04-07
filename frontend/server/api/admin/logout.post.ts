import { clearAdminCookie } from '../../utils/admin-auth'

export default defineEventHandler((event) => {
  clearAdminCookie(event)
  return { ok: true }
})
