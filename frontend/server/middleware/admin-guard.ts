import { verifyAdminCookie } from '../utils/admin-auth'

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname
  if (!path.startsWith('/api/admin/')) return
  if (path === '/api/admin/login') return  // login route is public

  if (!verifyAdminCookie(event)) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
})
