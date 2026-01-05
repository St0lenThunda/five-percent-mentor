<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-3 backdrop-blur-lg bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all"
    >
      <span class="text-2xl">👤</span>
      <div class="text-left">
        <div class="text-sm font-semibold">{{ username }}</div>
        <div class="text-xs text-purple-300">{{ email }}</div>
      </div>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if=" isOpen "
      class="absolute right-0 mt-2 w-64 backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-2xl overflow-hidden z-50"
    >
      <!-- Theme Submenu -->
      <div class="border-b border-white/10">
        <button
          @click="themesOpen = !themesOpen"
          class="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <span class="text-xl">🎨</span>
            <div>
              <div class="text-sm font-semibold text-white">Theme</div>
              <div class="text-xs text-purple-300">{{ themes[themeStore.currentTheme].name }}</div>
            </div>
          </div>
          <svg
            class="w-4 h-4 text-purple-300 transition-transform"
            :class="{ 'rotate-90': themesOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Theme Options (Collapsible) -->
        <div
          v-if=" themesOpen "
          class="px-3 pb-3 space-y-1"
        >
          <button
            v-for=" ( theme, key ) in themes "
            :key="key"
            @click="selectTheme( key )"
            class="w-full text-left px-3 py-2 rounded transition-all text-sm"
            :class="themeStore.currentTheme === key
              ? 'bg-primary-500/30 text-white border border-primary-400'
              : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-transparent'"
          >
            {{ theme.name }}
          </button>
        </div>
      </div>

      <!-- Sign Out Section -->
      <div class="p-2">
        <button
          @click="handleSignOut"
          class="w-full text-left px-4 py-3 text-red-300 hover:bg-red-500/20 rounded transition-colors flex items-center gap-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span class="font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useThemeStore } from '../stores/theme'
import { themes } from '../config/themes'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

const isOpen = ref( false )
const themesOpen = ref( false )

const username = computed( () => userStore.currentUser?.username || 'User' )
const email = computed( () => userStore.currentUser?.email || '' )

const selectTheme = ( themeName ) => {
  themeStore.setTheme( themeName )
}

const handleSignOut = async () => {
  await userStore.signOut()
  isOpen.value = false
  router.push( { name: 'login' } )
}

// Close dropdown when clicking outside
const closeDropdown = ( e ) => {
  if ( !e.target.closest( '.relative' ) ) {
    isOpen.value = false
  }
}

if ( typeof window !== 'undefined' ) {
  document.addEventListener( 'click', closeDropdown )
}
</script>
