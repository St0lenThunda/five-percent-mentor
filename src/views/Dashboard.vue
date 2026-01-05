<template>
  <div
    class="min-h-screen"
    :class="currentTheme.dashboard.bg"
  >
    <!-- Header -->
    <header class="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0 z-40">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <AppLogo class="w-10 h-10" />
            <div>
              <h1
                class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-primary-500">
                Unified 5% Knowledge System
              </h1>
              <p class="text-sm text-purple-200 mt-1">Knowledge → Wisdom → Understanding</p>
            </div>
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-12">
      <div class="mb-12 text-center">
        <h2 class="text-5xl font-bold mb-4 text-white">
          Peace ✊🏿
        </h2>
        <p class="text-xl text-purple-200 mb-2">
          Welcome, <span
            class="text-primary-400 font-semibold">{{ userStore.currentUser?.username || 'Builder' }}</span>
        </p>
        <p class="text-lg text-purple-300">
          Choose your path to Knowledge of Self
        </p>
      </div>

      <!-- Mathematics of the Day -->
      <MathematicsOfTheDay class="max-w-6xl mx-auto mb-16" />

      <!-- Modules Section -->
      <div class="max-w-6xl mx-auto mb-16">
        <h2 class="text-3xl font-bold mb-6 text-white flex items-center gap-3">
          <span class="text-primary-400">📚</span> Knowledge Modules
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
            v-for=" module in modules "
            :key="module.id"
            :to="module.route"
            class="group backdrop-blur-lg rounded-2xl shadow-xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            :class="[currentTheme.dashboard.cardBg, currentTheme.dashboard.cardBorder, currentTheme.dashboard.cardHover]"
          >
            <div
              :class="currentTheme.dashboard.icon"
              class="mb-4"
            >{{ getModuleIcon( module.id ) }}</div>
            <h3
              class="text-2xl font-bold mb-2 transition-colors"
              :class="currentTheme.dashboard.title"
            >
              {{ module.name }}
            </h3>
            <p
              class="text-sm mb-4"
              :class="currentTheme.dashboard.description"
            >
              {{ module.description }}
            </p>
            <div class="flex items-center text-primary-400 text-sm font-semibold">
              <span>Begin →</span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Tools Section -->
      <div class="max-w-6xl mx-auto mb-16">
        <h2 class="text-3xl font-bold mb-6 text-white flex items-center gap-3">
          <span class="text-primary-400">🔧</span> Builder Tools
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MathBreakdownTool class="col-span-1 md:col-span-2 lg:col-span-1" />

          <router-link
            v-for=" tool in tools "
            :key="tool.id"
            :to="tool.route"
            class="group backdrop-blur-lg rounded-2xl shadow-xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            :class="[currentTheme.dashboard.cardBg, currentTheme.dashboard.cardBorder, currentTheme.dashboard.cardHover]"
          >
            <div class="text-4xl mb-4 text-center">{{ tool.icon }}</div>
            <h3
              class="text-2xl font-bold mb-2 transition-colors text-center"
              :class="currentTheme.dashboard.title"
            >
              {{ tool.name }}
            </h3>
            <p
              class="text-sm mb-4 text-center"
              :class="currentTheme.dashboard.description"
            >
              {{ tool.description }}
            </p>
          </router-link>
        </div>
      </div>

      <!-- Progress Overview -->
      <div class="mt-16 max-w-4xl mx-auto backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10">
        <h3 class="text-2xl font-bold mb-6 text-white">Your Journey</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-400 mb-2">{{ stats.lessonsCompleted }}</div>
            <div class="text-sm text-purple-200">Lessons Completed</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-accent-400 mb-2">{{ stats.daysActive }}</div>
            <div class="text-sm text-purple-200">Days Active</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-gold-400 mb-2">{{ stats.cipherSessions }}</div>
            <div class="text-sm text-purple-200">Cipher Sessions</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-emerald-400 mb-2">{{ progressStore.quizCount }}</div>
            <div class="text-sm text-purple-200">Quizzes Completed</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useProgressStore } from '../stores/progress'
import { useThemeStore } from '../stores/theme'
import { themes, themeIcons } from '../config/themes'
import UserDropdown from '../components/UserDropdown.vue'
import AppLogo from '../components/AppLogo.vue'
import MathematicsOfTheDay from '../components/MathematicsOfTheDay.vue'
import MathBreakdownTool from '../components/tools/MathBreakdownTool.vue'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const progressStore = useProgressStore()

const currentTheme = computed( () => themes[themeStore.currentTheme] )
const getModuleIcon = ( id ) => themeIcons[themeStore.currentTheme][id]

const modules = ref( [
  {
    id: 1,
    name: 'Supreme Mathematics',
    description: 'Daily lessons on 1-10',
    route: '/supreme-mathematics'
  },
  {
    id: 2,
    name: 'Supreme Alphabet',
    description: 'Daily lessons on A-Z',
    route: '/supreme-alphabet'
  },
  {
    id: 3,
    name: '120 Lessons',
    description: 'Structured study companion',
    route: '/120-lessons'
  },
  {
    id: 4,
    name: 'Cipher Builder',
    description: 'Collaborative discussions',
    route: '/cipher-builder'
  },
  {
    id: 5,
    name: 'Born Day Journal',
    description: 'Daily reflections',
    route: '/born-day-journal'
  },
  {
    id: 6,
    name: 'Knowledge Library',
    description: 'Curated readings',
    route: '/knowledge-library'
  },
  {
    id: 7,
    name: 'Attribute Builder',
    description: 'Track 14 attributes',
    route: '/attribute-builder'
  },
  {
    id: 8,
    name: 'Self Assessment',
    description: 'Knowledge of self quizzes',
    route: '/self-assessment'
  }
] )

const tools = ref( [
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Master degrees with active recall',
    route: '/flashcards',
    icon: '🎴'
  },
  {
    id: 'quizzes',
    name: 'Quizzes',
    description: 'Test your understanding',
    route: '/quizzes',
    icon: '🎯'
  }
] )



// Mock stats - will be replaced with real data from progress store
const stats = ref( {
  lessonsCompleted: 0,
  daysActive: 1,
  cipherSessions: 0
} )

import { onMounted } from 'vue'

onMounted( () => {
  progressStore.fetchUserProgress()
} )
</script>
