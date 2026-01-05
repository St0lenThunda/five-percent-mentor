<template>
  <div
    class="rounded-2xl border transition-all duration-300 overflow-hidden"
    :class="[
      themes[themeStore.currentTheme].dashboard.cardBg,
      themes[themeStore.currentTheme].dashboard.cardBorder,
      'hover:border-opacity-80'
    ]"
  >
    <!-- Header -->
    <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🧮</span>
        <h3 class="text-lg font-bold text-white">Mathematics Calculator</h3>
      </div>
      <div class="flex gap-2 text-xs font-semibold bg-white/10 p-1 rounded-lg">
        <button
          @click="mode = 'word'"
          class="px-3 py-1 rounded transition-colors"
          :class="mode === 'word' ? 'bg-primary-500 text-white' : 'hover:bg-white/10 text-purple-200'"
        >
          Word
        </button>
        <button
          @click="mode = 'date'"
          class="px-3 py-1 rounded transition-colors"
          :class="mode === 'date' ? 'bg-primary-500 text-white' : 'hover:bg-white/10 text-purple-200'"
        >
          Date
        </button>
      </div>
    </div>

    <div class="p-6">
      <!-- Input Area -->
      <div class="mb-6 relative">
        <input
          v-if=" mode === 'word' "
          v-model="input"
          type="text"
          placeholder="Enter a word (e.g., PEACE)"
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg text-white placeholder-white/30 focus:outline-none focus:border-primary-500 transition-colors uppercase"
          @keyup.enter="calculate"
        />
        <input
          v-else
          v-model="dateInput"
          type="date"
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg text-white placeholder-white/30 focus:outline-none focus:border-primary-500 transition-colors"
          @change="calculate"
        />
        <button
          @click="calculate"
          class="absolute right-2 top-2 bottom-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold transition-colors"
        >
          Build
        </button>
      </div>

      <!-- Result Area -->
      <div
        v-if=" result "
        class="animate-fadeIn"
      >
        <!-- Breakdown Visual -->
        <div
          class="flex flex-wrap items-center gap-2 mb-6 text-sm md:text-base font-mono bg-black/20 p-4 rounded-xl overflow-x-auto"
        >
          <template v-if=" result.breakdown ">
            <template
              v-for=" ( item, index ) in result.breakdown "
              :key="index"
            >
              <div class="flex flex-col items-center">
                <span class="text-purple-300">{{ item.char }}</span>
                <span class="text-xs opacity-50">{{ item.val }}</span>
              </div>
              <span
                v-if=" index < result.breakdown.length - 1 "
                class="text-white/30"
              >+</span>
            </template>
            <span class="text-white/50">=</span>
            <span class="text-xl font-bold text-white">{{ result.sum }}</span>
            <span class="text-primary-400">→</span>
          </template>

          <template v-else>
            <span class="text-purple-300">Sum of digits</span>
            <span class="text-white/50">=</span>
            <span class="text-xl font-bold text-white">{{ result.sum }}</span>
            <span class="text-primary-400">→</span>
          </template>

          <div
            class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-xl font-black text-white shadow-lg ml-2"
          >
            {{ result.number }}
          </div>
        </div>

        <!-- Principle Card -->
        <div class="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
          <div
            class="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform select-none"
          >
            {{ result.number }}
          </div>

          <div class="relative z-10">
            <h4 class="text-2xl font-bold text-white mb-2">{{ result.name }}</h4>
            <p class="text-purple-200 mb-6 leading-relaxed">{{ result.meaning }}</p>

            <div class="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
              <div class="text-xs uppercase tracking-wider font-bold text-primary-400 mb-2 flex items-center gap-2">
                <span>💡</span> Personal Application
              </div>
              <p class="text-sm text-white italic">"{{ result.application }}"</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-8 opacity-40"
      >
        <div class="text-4xl mb-2">🔭</div>
        <p>Enter data to reveal the mathematics</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useMathematics } from '../../composables/useMathematics'
import { useThemeStore } from '../../stores/theme'
import { themes } from '../../config/themes'

const themeStore = useThemeStore()
const { calculateWordMath, calculateDateInput } = useMathematics()

const mode = ref( 'word' )
const input = ref( '' )
const dateInput = ref( '' )
const result = ref( null )

const calculate = () => {
  if ( mode.value === 'word' ) {
    result.value = calculateWordMath( input.value )
  } else {
    result.value = calculateDateInput( dateInput.value )
  }
}

// Clear result when switching modes
watch( mode, () => {
  result.value = null
  input.value = ''
  dateInput.value = ''
} )
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
