<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0 z-40">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link
            to="/quizzes"
            class="flex items-center gap-3 group"
          >
            <span class="text-3xl">📊</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">Quiz History</h1>
              <p class="text-xs text-purple-300">Trends & Past Results</p>
            </div>
          </router-link>
          <router-link
            to="/quizzes"
            class="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-colors text-purple-200 hover:text-white"
          >
            ← Back to Quizzes
          </router-link>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-6 py-12">
      <!-- Full Page Loading State -->
      <div
        v-if=" progressStore.isLoading && progressStore.quizHistory.length === 0 "
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="animate-spin text-6xl mb-4">🌀</div>
        <p class="text-purple-300">Loading your cipher history...</p>
      </div>

      <div
        v-else
        class="max-w-6xl mx-auto space-y-12"
      >
        <!-- Stats Overview -->
        <StatsGrid
          v-if=" progressStore.quizHistory.length > 0 "
          :stats="statsData"
        />

        <div
          v-if=" progressStore.quizHistory.length > 0 "
          class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start"
        >
          <!-- Calendar Sidebar (1/4) -->
          <div class="lg:col-span-1 space-y-6 sticky top-24">
            <ActivityCalendar
              title="Representing Days"
              :activity-dates="activityDates"
              v-model:selected-date="dateFilter"
            />

            <div
              class="p-4 rounded-xl bg-primary-500/5 border border-primary-500/10 text-[11px] text-purple-300 leading-relaxed"
            >
              <p>📌 <strong class="text-primary-400">Pro-tip:</strong> Select a day on the calendar to filter results
                and track consistency.</p>
            </div>
          </div>

          <!-- History Table (3/4) -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Filter indicator -->
            <div
              v-if=" dateFilter "
              class="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl"
            >
              <span class="text-xs text-purple-300">Showing quizzes for:</span>
              <span
                class="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-lg font-semibold text-xs">{{ formatDisplayDate( dateFilter ) }}</span>
              <button
                @click="dateFilter = null"
                class="text-purple-400 hover:text-white flex items-center gap-1 ml-auto text-xs"
              >
                <span>&times;</span> Clear filter
              </button>
            </div>

            <HistoryTable
              title="Quiz Results"
              icon="📊"
              :items="filteredQuizzes"
              :columns="columns"
              :loading="progressStore.isLoading"
              empty-icon="🎯"
              empty-text="No quizzes completed yet. Start representing to build your history!"
              @row-click="openDetail"
            >
              <template #header-actions>
                <router-link
                  to="/quizzes"
                  class="text-sm font-bold text-primary-400 hover:text-primary-300"
                >
                  Take a Quiz →
                </router-link>
              </template>
              <template #cell-date=" { item } ">
                <span class="text-sm text-purple-200">{{ formatDate( item.createdAt ) }}</span>
              </template>
              <template #cell-score=" { item } ">
                <span class="text-sm font-bold text-white">{{ item.score }} / {{ item.totalQuestions }}</span>
              </template>
              <template #cell-topics=" { item } ">
                <div class="flex gap-1 flex-wrap">
                  <span
                    v-for=" topic in item.topics "
                    :key="topic"
                    class="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-purple-300"
                  >
                    {{ getTopicLabel( topic ) }}
                  </span>
                </div>
              </template>
              <template #cell-percent=" { item } ">
                <span :class="getPercentClass( item.score, item.totalQuestions )">
                  {{ Math.round( ( item.score / item.totalQuestions ) * 100 ) }}%
                </span>
              </template>
            </HistoryTable>
          </div>
        </div>

        <!-- Empty state fallback -->
        <div
          v-else
          class="text-center py-20 bg-white/5 rounded-3xl border border-white/10"
        >
          <div class="text-6xl mb-4">🎯</div>
          <h2 class="text-2xl font-bold text-white mb-2">No History Found</h2>
          <p class="text-purple-300 mb-8 max-w-md mx-auto">You haven't completed any quizzes yet. Start testing your
            knowledge
            to track your progress.</p>
          <router-link
            to="/quizzes"
            class="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary-500/25"
          >
            Take Your First Quiz
          </router-link>
        </div>
      </div>
    </main>

    <!-- Detail Modal -->
    <div
      v-if=" selectedQuiz "
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="selectedQuiz = null"
    >
      <div class="bg-gray-900 border border-white/20 rounded-2xl max-w-lg w-full">
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <div class="text-sm text-purple-400">{{ formatDate( selectedQuiz.createdAt ) }}</div>
            <h3 class="text-xl font-bold text-white">Quiz Result</h3>
          </div>
          <button
            @click="selectedQuiz = null"
            class="text-purple-400 hover:text-white text-2xl"
          >&times;</button>
        </div>
        <div class="p-6">
          <div class="text-center mb-6">
            <div
              class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gold-400 to-primary-500">
              {{ Math.round( ( selectedQuiz.score / selectedQuiz.totalQuestions ) * 100 ) }}%
            </div>
            <p class="text-purple-300 mt-2">{{ selectedQuiz.score }} correct out of {{ selectedQuiz.totalQuestions }}
            </p>
          </div>
          <div class="mb-4">
            <div class="text-sm text-purple-400 mb-2">Topics Covered:</div>
            <div class="flex gap-2 flex-wrap">
              <span
                v-for=" topic in selectedQuiz.topics "
                :key="topic"
                class="px-3 py-1 rounded-full bg-white/10 text-purple-200"
              >
                {{ getTopicLabel( topic ) }}
              </span>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-white/10 flex justify-end">
          <button
            @click="selectedQuiz = null"
            class="px-6 py-2 bg-white/10 hover:bg-white/20 text-purple-200 rounded-lg"
          >Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProgressStore } from '../../stores/progress'
import ActivityCalendar from '../../components/ActivityCalendar.vue'
import HistoryTable from '../../components/HistoryTable.vue'
import StatsGrid from '../../components/StatsGrid.vue'

const progressStore = useProgressStore()

// UI state
const selectedQuiz = ref( null )
const dateFilter = ref( null )

// Table columns
const columns = [
  { key: 'date', label: 'Date' },
  { key: 'score', label: 'Score' },
  { key: 'topics', label: 'Topics' },
  { key: 'percent', label: '%', align: 'right' }
]

// Stats
const averageScore = computed( () => {
  if ( progressStore.quizHistory.length === 0 ) return 0
  const total = progressStore.quizHistory.reduce( ( sum, q ) => sum + Math.round( ( q.score / q.totalQuestions ) * 100 ), 0 )
  return Math.round( total / progressStore.quizHistory.length )
} )

const bestScore = computed( () => {
  if ( progressStore.quizHistory.length === 0 ) return 0
  return Math.max( ...progressStore.quizHistory.map( q => Math.round( ( q.score / q.totalQuestions ) * 100 ) ) )
} )

const thisMonthCount = computed( () => {
  const now = new Date()
  const yearMonth = `${now.getFullYear()}-${String( now.getMonth() + 1 ).padStart( 2, '0' )}`
  return progressStore.quizHistory.filter( q => {
    const dateStr = q.createdAt instanceof Date ? q.createdAt.toISOString() : q.createdAt
    return dateStr?.startsWith( yearMonth )
  } ).length
} )

const statsData = computed( () => [
  { value: progressStore.quizHistory.length, label: 'Total Quizzes', color: 'text-primary-400' },
  { value: `${averageScore.value}%`, label: 'Avg Score', color: 'text-gold-400' },
  { value: `${bestScore.value}%`, label: 'Best Score', color: 'text-green-400' },
  { value: thisMonthCount.value, label: 'This Month', color: 'text-accent-400' }
] )

// Helper to get date string from Date or string
const getDateStr = ( dateVal ) => {
  if ( !dateVal ) return null
  if ( typeof dateVal === 'string' ) return dateVal.split( 'T' )[0]
  if ( dateVal instanceof Date ) return dateVal.toISOString().split( 'T' )[0]
  return null
}

// Computed
const activityDates = computed( () => progressStore.quizHistory.map( q => getDateStr( q.createdAt ) ).filter( Boolean ) )

const filteredQuizzes = computed( () => {
  if ( dateFilter.value ) return progressStore.quizHistory.filter( q => getDateStr( q.createdAt ) === dateFilter.value )
  return progressStore.quizHistory
} )

// Helpers
const formatDate = ( dateStr ) => dateStr ? new Date( dateStr ).toLocaleDateString( 'en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' } ) : ''
const formatDisplayDate = ( dateStr ) => new Date( dateStr ).toLocaleDateString( 'en-US', { weekday: 'short', month: 'short', day: 'numeric' } )
const getTopicLabel = ( topic ) => ( { math: 'Mathematics', alphabet: 'Alphabet', jewels: '12 Jewels', lessons: '120 Lessons' } )[topic] || topic
const getPercentClass = ( score, total ) => {
  const pct = ( score / total ) * 100
  if ( pct >= 80 ) return 'text-green-400 font-bold'
  if ( pct >= 60 ) return 'text-gold-400 font-bold'
  return 'text-red-400 font-bold'
}
const openDetail = ( quiz ) => { selectedQuiz.value = quiz }

onMounted( () => progressStore.fetchUserProgress() )
</script>
