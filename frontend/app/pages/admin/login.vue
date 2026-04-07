<script setup lang="ts">
definePageMeta({ layout: false })

const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: password.value } })
    await navigateTo('/admin')
  } catch {
    error.value = 'Incorrect password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">✦</div>
      <h1 class="login-title">Proudscroll Admin</h1>

      <form class="login-form" @submit.prevent="login">
        <input
          v-model="password"
          type="password"
          class="login-input"
          placeholder="Password"
          autofocus
          required
        />
        <p v-if="error" class="login-error">{{ error }}</p>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100dvh;
  background: #0F0D0B;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.login-logo {
  font-size: 2rem;
  color: #D4A853;
}

.login-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 400;
  color: #F5F0E8;
  text-align: center;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.login-input {
  width: 100%;
  box-sizing: border-box;
  background: rgba(245, 240, 232, 0.05);
  border: 1px solid rgba(245, 240, 232, 0.12);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  color: #F5F0E8;
  outline: none;
  transition: border-color 0.2s;
}
.login-input:focus { border-color: rgba(212, 168, 83, 0.5); }

.login-error {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: #E05C3A;
  text-align: center;
}

.login-btn {
  width: 100%;
  background: #D4A853;
  color: #0F0D0B;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 500;
  border: none;
  border-radius: 10px;
  padding: 0.75rem;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}
.login-btn:hover:not(:disabled) { background: #e0b860; }
.login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
