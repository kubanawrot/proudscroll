export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/admin')) return
  if (to.path === '/admin/login') return

  // Check for the admin cookie client-side (httpOnly so we can't read it,
  // but the cookie's presence as a non-httpOnly marker lets us know)
  const cookie = useCookie('ps_admin_ui')
  if (!cookie.value) {
    return navigateTo('/admin/login')
  }
})
