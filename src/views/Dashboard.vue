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
                Unified NGE Knowledge System
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

      <!-- Active Building Focus -->
      <div
        v-if=" buildingAttribute "
        class="max-w-6xl mx-auto mb-16 relative group"
      >
        <div
          class="absolute -inset-1 bg-gradient-to-r from-gold-500/50 to-primary-500/50 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
        ></div>
        <div
          class="relative backdrop-blur-2xl bg-black/40 border border-gold-500/20 rounded-[2.5rem] p-10 overflow-hidden flex flex-col md:flex-row items-center gap-12"
        >
          <!-- Focal Visual -->
          <div class="relative">
            <div class="w-32 h-32 rounded-full border-4 border-gold-500/20 flex items-center justify-center relative">
              <div class="absolute inset-0 border-t-4 border-gold-500 rounded-full animate-spin-slow"></div>
              <div class="text-5xl">⚡</div>
            </div>
            <div
              class="absolute -bottom-2 -right-2 bg-gold-500 text-black text-[10px] font-black px-2 py-1 rounded-md tracking-widest uppercase"
            >
              ACTIVE
            </div>
          </div>

          <div class="flex-1 text-center md:text-left">
            <h4 class="text-xs font-black text-gold-400 uppercase tracking-[0.4em] mb-2">Currently Building</h4>
            <h3 class="text-4xl font-black text-white mb-4 tracking-tighter">{{ buildingAttribute.name }}</h3>
            <p class="text-purple-200/70 text-lg leading-relaxed max-w-xl">
              Focusing on <span class="text-white font-bold">{{ buildingAttribute.meaning }}</span>.
              Increase your consistency by completing relevant lessons in <span
                class="text-gold-400 lowercase">{{ buildingAttribute.growthTriggers?.join( ', ' ) }}</span>.
            </p>
          </div>

          <div class="w-full md:w-64 space-y-4">
            <div class="flex justify-between text-xs font-bold uppercase tracking-widest">
              <span class="text-purple-300">Manifestation</span>
              <span class="text-gold-400">{{ ( buildingProgress?.level || 0 ) * 10 }}%</span>
            </div>
            <div class="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div
                class="h-full bg-gradient-to-r from-gold-600 to-amber-400 transition-all duration-1000"
                :style="{ width: `${( buildingProgress?.level || 0 ) * 10}%` }"
              ></div>
            </div>
            <router-link
              to="/attribute-builder"
              class="block w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center text-xs font-black tracking-widest uppercase text-white transition-all"
            >
              View All Attributes
            </router-link>
          </div>
        </div>
      </div>

      <!-- Start Building Prompt (if no focus) -->
      <div
        v-else
        class="max-w-6xl mx-auto mb-16"
      >
        <router-link
          to="/attribute-builder"
          class="block backdrop-blur-xl bg-white/5 border border-white/10 hover:border-primary-500/50 rounded-3xl p-8 text-center group transition-all"
        >
          <div class="text-primary-400 text-sm font-black tracking-[0.4em] uppercase mb-2">Knowledge without action is
            incomplete</div>
          <h3 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">Select an Attribute
            to begin Building Consistency ✊🏿</h3>
        </router-link>
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
            class="group perspective-1000 block"
          >
            <div
              class="relative h-full backdrop-blur-lg rounded-3xl shadow-xl p-8 border transition-all duration-700 transform-style-3d group-hover:rotate-y-15 group-hover:rotate-x-8 group-hover:bg-primary-500/10"
              :class="[currentTheme.dashboard.cardBg, currentTheme.dashboard.cardBorder, currentTheme.dashboard.cardHover]"
            >
              <div
                :class="currentTheme.dashboard.icon"
                class="mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >{{ getModuleIcon( module.id ) }}</div>
              <h3
                class="text-2xl font-black mb-3 transition-all group-hover:tracking-tight"
                :class="currentTheme.dashboard.title"
              >
                {{ module.name }}
              </h3>
              <p
                class="text-sm mb-6 leading-relaxed"
                :class="currentTheme.dashboard.description"
              >
                {{ module.description }}
              </p>
              <div
                class="flex items-center text-primary-400 text-xs font-black tracking-widest uppercase gap-2 transition-all group-hover:gap-4"
              >
                <span>Begin Path</span>
                <span class="text-lg">→</span>
              </div>
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
import { useAttributesStore } from '../stores/attributes'
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
const attributesStore = useAttributesStore()

const currentTheme = computed( () => themes[themeStore.currentTheme] )
const getModuleIcon = ( id ) => themeIcons[themeStore.currentTheme][id]

const buildingProgress = computed( () => {
  const activeId = Object.keys( attributesStore.attributeProgress ).find( id => attributesStore.attributeProgress[id].isBuilding )
  return activeId ? { id: activeId, ...attributesStore.attributeProgress[activeId] } : null
} )

const buildingAttribute = computed( () => {
  return buildingProgress.value ? attributesStore.staticAttributes.find( a => a.id === buildingProgress.value.id ) : null
} )

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
    description: 'Master the 14 attributes of a righteous person',
    route: '/attribute-builder'
  },
  {
    id: 8,
    name: 'Self Assessment',
    description: 'Knowledge of self quizzes',
    route: '/self-assessment'
  },
  {
    id: 9,
    name: 'Visual Map',
    description: '3D Knowledge Graph exploration',
    route: '/visual-map'
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
  attributesStore.fetchAttributes()
} )
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.group-hover\:rotate-y-15:hover {
  transform: rotateY(15deg);
}

.group-hover\:rotate-x-8:hover {
  transform: rotateX(8deg);
}

/* More robust selector since tailwind variants can be tricky with custom rotations */
.group:hover .transform-style-3d {
  transform: rotateY(15deg) rotateX(8deg);
}
</style>
