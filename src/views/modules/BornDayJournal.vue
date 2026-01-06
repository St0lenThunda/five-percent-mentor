<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0 z-40">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center gap-3 group">
            <span class="text-3xl">📔</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                Born Day Journal
              </h1>
              <p class="text-xs text-purple-300">{{ getDayAndMonth }}</p>
            </div>
          </router-link>
          <div class="flex items-center gap-3">
            <router-link
              to="/journal-history"
              class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-colors text-purple-200 hover:text-white flex items-center gap-2"
            >
              <span>📚</span> View History
            </router-link>
            <router-link to="/" class="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-colors text-purple-200 hover:text-white">
              ← Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-6 py-12">
      <div class="max-w-3xl mx-auto">
        <!-- Today's Mathematics Card -->
        <div class="mb-10 p-6 rounded-2xl bg-gradient-to-br from-primary-900/40 to-gray-900 border border-primary-500/30">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="text-center">
              <div class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gold-400 to-primary-500">
                {{ dayMath.number }}
              </div>
              <div class="text-sm text-purple-300 mt-1">Day's Degree</div>
            </div>
            <div class="flex-1 text-center md:text-left">
              <h2 class="text-3xl font-bold text-white mb-2">{{ dayMath.name }}</h2>
              <p class="text-purple-200 mb-3">{{ dayMath.meaning }}</p>
              <p class="text-sm text-primary-300 italic">{{ dayMath.application }}</p>
            </div>
          </div>
        </div>

        <!-- Journal Entry Form -->
        <div class="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-2xl">✍️</span>
            <h2 class="text-2xl font-bold text-white">Today's Reflection</h2>
          </div>

          <form @submit.prevent="saveJournal" class="space-y-6">
            <!-- Guided Prompts -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <!-- Culture Prompt (Special) -->
              <button
                v-if=" culturePrompt "
                type="button"
                @click="insertPrompt( culturePrompt.prompt )"
                class="md:col-span-2 p-4 text-left rounded-2xl bg-primary-500/10 border border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/20 transition-all group relative overflow-hidden"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                  >
                    {{ culturePrompt.letter }}
                  </div>
                  <div>
                    <div class="text-xs text-primary-400 font-black uppercase tracking-widest mb-1">Culture Prompt:
                      {{ culturePrompt.name }}
                    </div>
                    <p class="text-sm text-white font-medium italic leading-relaxed">{{ culturePrompt.prompt }}</p>
                  </div>
                </div>
                <div
                  class="absolute top-2 right-4 text-[10px] font-black text-primary-500/40 uppercase tracking-widest">
                  Build Choice</div>
              </button>

              <button
                v-for="(prompt, index) in todayPrompts"
                :key="index"
                type="button"
                @click="insertPrompt(prompt)"
                class="p-3 text-left rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/50 hover:bg-white/10 transition-all group"
              >
                <div class="text-xs text-primary-400 font-semibold mb-1">Prompt {{ index + 1 }}</div>
                <p class="text-sm text-purple-200 group-hover:text-white transition-colors">{{ prompt }}</p>
              </button>
            </div>

            <!-- Entry Text Area -->
            <div>
              <label class="block text-sm font-semibold text-purple-300 mb-2">Your Reflection</label>
              <textarea
                v-model="entryText"
                rows="8"
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                :placeholder="`How did ${dayMath.name} manifest in your life today?`"
              ></textarea>
            </div>

            <!-- Additional Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-purple-300 mb-2">🙏🏿 Gratitude</label>
                <input v-model="gratitude" type="text" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-primary-500" placeholder="What are you grateful for today?" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-purple-300 mb-2">🎯 Tomorrow's Intention</label>
                <input v-model="intention" type="text" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-primary-500" placeholder="What will you manifest tomorrow?" />
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div v-if="todayEntry" class="text-sm text-gold-400">
                ✓ You've already journaled today
              </div>
              <div v-else></div>
              <button type="submit" :disabled="journalStore.isSaving || !entryText.trim()" class="px-8 py-3 bg-gradient-to-r from-primary-500 to-gold-500 hover:from-primary-600 hover:to-gold-600 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ journalStore.isSaving ? 'Saving...' : 'Save Reflection' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Quick Stats -->
        <div class="mt-8 grid grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <div class="text-2xl font-bold text-primary-400">{{ journalStore.entries.length }}</div>
            <div class="text-xs text-purple-300">Total Entries</div>
          </div>
          <div class="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <div class="text-2xl font-bold text-gold-400">{{ currentStreak }}</div>
            <div class="text-xs text-purple-300">Day Streak</div>
          </div>
          <div class="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <div class="text-2xl font-bold text-accent-400">{{ thisMonthCount }}</div>
            <div class="text-xs text-purple-300">This Month</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMathematics } from '../../composables/useMathematics'
import { useJournalStore } from '../../stores/journal'
import { useContentStore } from '../../stores/content'

const journalStore = useJournalStore()
const contentStore = useContentStore()
const { dayMath, fullDateMath, getDayAndMonth } = useMathematics()

// Form state
const entryText = ref('')
const gratitude = ref('')
const intention = ref('')

// Prompts
const todayPrompts = computed(() => [
  `How did ${dayMath.value.name} (${dayMath.value.number}) show up in your life today?`,
  `In what ways did you apply ${dayMath.value.application.toLowerCase()}?`,
  `What lesson did the universe teach you about ${dayMath.value.name} today?`,
  `How will you use ${dayMath.value.name} to build toward ${fullDateMath.value.name}?`
])

const culturePrompt = computed( () => {
  if ( !contentStore.alphabet || contentStore.alphabet.length === 0 ) return null
  const dayOfMonth = new Date().getDate()
  const alpha = contentStore.alphabet[( dayOfMonth - 1 ) % contentStore.alphabet.length]
  return {
    letter: alpha.letter,
    name: alpha.name,
    prompt: `How does the principle of ${alpha.name} (${alpha.letter}) influence your current Culture and way of life?`
  }
} )

const todayEntry = computed(() => journalStore.getTodayEntry())

// Stats
const currentStreak = computed(() => {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(today.getDate() - i)
    const dateStr = checkDate.toISOString().split('T')[0]
    if (journalStore.entries.some(e => e.date === dateStr)) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
})

const thisMonthCount = computed(() => {
  const now = new Date()
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return journalStore.entries.filter(e => e.date.startsWith(yearMonth)).length
})

const insertPrompt = (prompt) => {
  if (entryText.value && !entryText.value.endsWith('\n\n')) entryText.value += '\n\n'
  entryText.value += prompt + '\n\n'
}

const saveJournal = async () => {
  if (!entryText.value.trim()) return
  let fullEntry = entryText.value.trim()
  if (gratitude.value.trim()) fullEntry += `\n\n🙏🏿 Gratitude: ${gratitude.value.trim()}`
  if (intention.value.trim()) fullEntry += `\n\n🎯 Tomorrow: ${intention.value.trim()}`

  await journalStore.saveEntry({
    date: new Date().toISOString().split('T')[0],
    mathematicsId: String(dayMath.value.number),
    entryText: fullEntry
  })
  entryText.value = ''
  gratitude.value = ''
  intention.value = ''
}

onMounted( async () => {
  await contentStore.fetchAllContent()
  journalStore.fetchEntries()
} )
</script>
