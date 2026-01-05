<template>
  <div
    class="mb-8 rounded-2xl border transition-all duration-300 overflow-hidden"
    :class="[
      themes[themeStore.currentTheme].dashboard.cardBg,
      themes[themeStore.currentTheme].dashboard.cardBorder,
      isOpen ? 'shadow-lg' : 'hover:border-opacity-50'
    ]"
  >
    <!-- Header / Toggle -->
    <button
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between p-6 transition-colors hover:bg-white/5"
    >
      <div class="flex items-center gap-4">
        <div class="text-3xl">📅</div>
        <div class="text-left">
          <h3
            class="text-xl font-bold transition-colors"
            :class="themes[themeStore.currentTheme].dashboard.title"
          >
            Mathematics of the Day
          </h3>
          <p
            class="text-xs opacity-70"
            :class="themes[themeStore.currentTheme].dashboard.description"
          >
            {{ getDayAndMonth }}
          </p>
        </div>
      </div>

      <!-- Preview (when collapsed) -->
      <div
        v-if=" !isOpen "
        class="hidden md:flex items-center gap-6 mr-4 opacity-60"
      >
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold">Day:</span>
          <span class="font-bold">{{ dayMath.number }} ({{ dayMath.name }})</span>
        </div>
        <div class="w-px h-4 bg-current opacity-20"></div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold">Full:</span>
          <span class="font-bold">{{ fullDateMath.number }} ({{ fullDateMath.name }})</span>
        </div>
      </div>

      <!-- Chevron -->
      <svg
        class="w-5 h-5 transition-transform duration-300"
        :class="[isOpen ? 'rotate-180' : '', themes[themeStore.currentTheme].dashboard.title]"
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

    <!-- Expanded Content -->
    <div
      v-if=" isOpen "
      class="px-6 pb-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn"
    >
      <!-- Day Math -->
      <div class="rounded-xl p-5 border border-white/5 bg-white/5">
        <div class="text-xs uppercase tracking-wider font-semibold opacity-50 mb-2">Day Calculation</div>
        <div class="flex items-center gap-4 mb-3">
          <div class="text-4xl font-black opacity-80">{{ dayMath.number }}</div>
          <div>
            <div class="text-xl font-bold">{{ dayMath.name }}</div>
          </div>
        </div>
        <p class="text-sm opacity-80 leading-relaxed">{{ dayMath.meaning }}</p>
      </div>

      <!-- Full Date Math -->
      <div class="rounded-xl p-5 border border-white/5 bg-white/5">
        <div class="text-xs uppercase tracking-wider font-semibold opacity-50 mb-2">Full Date Calculation</div>
        <div class="flex items-center gap-4 mb-3">
          <div class="text-4xl font-black opacity-80">{{ fullDateMath.number }}</div>
          <div>
            <div class="text-xl font-bold">{{ fullDateMath.name }}</div>
          </div>
        </div>
        <p class="text-sm opacity-80 leading-relaxed">{{ fullDateMath.meaning }}</p>
      </div>

      <!-- Build Prompt -->
      <div class="md:col-span-2 mt-2 pt-4 border-t border-white/10">
        <p class="text-sm italic text-center opacity-70">
          "How will you use <strong>{{ dayMath.name }}</strong> to make your <strong>{{ fullDateMath.name }}</strong>
          manifest today?"
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMathematics } from '../composables/useMathematics'
import { useThemeStore } from '../stores/theme'
import { themes } from '../config/themes'

const isOpen = ref( false ) // Default to closed
const themeStore = useThemeStore()
const { dayMath, fullDateMath, getDayAndMonth } = useMathematics()
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
