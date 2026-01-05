<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-primary-500">Peace</span> ✊🏿
        </h1>
        <p class="text-purple-200">Knowledge of Self Begins</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="error" class="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-200">
          {{ error }}
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-purple-200 mb-2">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-purple-300/50"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-purple-200 mb-2">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-purple-300/50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold py-3 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <router-link to="/signup" class="text-sm text-purple-300 hover:text-primary-400 transition-colors">
          Need an account? <span class="font-semibold">Sign Up</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await userStore.signIn(email.value, password.value)
    router.push({ name: 'dashboard' })
  } catch (err) {
    error.value = err.message || 'Failed to sign in. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>
