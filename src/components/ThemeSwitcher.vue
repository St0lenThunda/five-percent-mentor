<template>
  <div class="fixed top-4 right-4 z-50">
    <button
      @click="isOpen = !isOpen"
      class="backdrop-blur-lg bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all"
    >
      🎨 Theme: {{ themes[themeStore.currentTheme].name }}
    </button>
    
    <div v-if="isOpen" class="mt-2 backdrop-blur-lg bg-white/10 rounded-lg border border-white/20 p-4 min-w-[250px]">
      <div class="text-xs text-purple-200 mb-3 uppercase tracking-wide">Select Theme</div>
      <div class="space-y-2">
        <button
          v-for="(theme, key) in themes"
          :key="key"
          @click="selectTheme(key)"
          class="w-full text-left px-3 py-2 rounded transition-all"
          :class="themeStore.currentTheme === key 
            ? 'bg-primary-500/30 text-white border border-primary-400' 
            : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-transparent'"
        >
          {{ theme.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '../stores/theme'
import { themes } from '../config/themes'

const themeStore = useThemeStore()
const isOpen = ref(false)

const selectTheme = (themeName) => {
  themeStore.setTheme(themeName)
  isOpen.value = false
}
</script>
