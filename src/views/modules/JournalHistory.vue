<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0 z-40">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link
            to="/born-day-journal"
            class="flex items-center gap-3 group"
          >
            <span class="text-3xl">📚</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">Journal History
              </h1>
              <p class="text-xs text-purple-300">Past Reflections & Trends</p>
            </div>
          </router-link>
          <router-link
            to="/born-day-journal"
            class="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-colors text-purple-200 hover:text-white"
          >
            ← Back to Journal
          </router-link>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-6 py-12">
      <div class="max-w-6xl mx-auto space-y-12">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <!-- Calendar Sidebar (1/4) -->
          <div class="lg:col-span-1 space-y-6 sticky top-24">
            <ActivityCalendar
              title="Reflection Days"
              :activity-dates="activityDates"
              v-model:selected-date="dateFilter"
            />

            <div
              class="p-4 rounded-xl bg-gold-500/5 border border-gold-500/10 text-[11px] text-purple-300 leading-relaxed text-center"
            >
              <p>✨ <strong class="text-gold-400">Consistency is Key:</strong> Looking back at your journey helps
                solidify your understanding.</p>
            </div>
          </div>

          <!-- Entries Table (3/4) -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Filter indicator -->
            <div
              v-if=" dateFilter "
              class="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl"
            >
              <span class="text-xs text-purple-300">Showing entries for:</span>
              <span
                class="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-lg font-semibold text-xs">{{ formatDisplayDate( dateFilter ) }}</span>
              <button
                @click="dateFilter = null"
                class="text-purple-400 hover:text-white flex items-center gap-1 ml-auto text-xs"
              >
                <span>&times;</span> Clear filter
              </button>
            </div>

            <!-- Entries Table -->
            <HistoryTable
              title="Journal Entries"
              icon="📝"
              :items="filteredEntries"
              :columns="columns"
              :loading="journalStore.isLoading"
              empty-icon="📝"
              empty-text="No entries found for this period."
              @row-click="openDetail"
            >
              <template #header-actions>
                <router-link
                  to="/born-day-journal"
                  class="text-sm font-bold text-primary-400 hover:text-primary-300"
                >
                  Write Today →
                </router-link>
              </template>
              <template #cell-date=" { item } ">
                <span class="text-sm text-purple-200">{{ formatDate( item.date ) }}</span>
              </template>
              <template #cell-math=" { item } ">
                <span class="inline-flex items-center gap-2">
                  <span class="text-lg font-bold text-primary-400">{{ item.mathematicsId }}</span>
                  <span class="text-xs text-purple-400">{{ getPrincipleName( item.mathematicsId ) }}</span>
                </span>
              </template>
              <template #cell-preview=" { item } ">
                <span
                  class="text-sm text-purple-300 max-w-md truncate block">{{ item.entryText.substring( 0, 80 ) }}...</span>
              </template>
              <template #cell-actions=" { item } ">
                <div
                  class="text-right"
                  @click.stop
                >
                  <button
                    @click="openEdit( item )"
                    class="text-primary-400 hover:text-primary-300 mr-3 text-xs"
                  >Edit</button>
                  <button
                    @click="confirmDelete( item )"
                    class="text-red-400 hover:text-red-300 text-xs"
                  >Delete</button>
                </div>
              </template>
            </HistoryTable>
          </div>
        </div>
      </div>
    </main>

    <!-- Detail Modal -->
    <div
      v-if=" selectedEntry "
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="selectedEntry = null"
    >
      <div class="bg-gray-900 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <div class="text-sm text-purple-400">{{ formatDate( selectedEntry.date ) }}</div>
            <h3 class="text-xl font-bold text-white">{{ getPrincipleName( selectedEntry.mathematicsId ) }}
              ({{ selectedEntry.mathematicsId }})</h3>
          </div>
          <button
            @click="selectedEntry = null"
            class="text-purple-400 hover:text-white text-2xl"
          >&times;</button>
        </div>
        <div class="p-6">
          <p class="text-purple-100 whitespace-pre-wrap leading-relaxed">{{ selectedEntry.entryText }}</p>
        </div>
        <div class="p-6 border-t border-white/10 flex justify-end gap-3">
          <button
            @click="openEdit( selectedEntry )"
            class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
          >Edit</button>
          <button
            @click="confirmDelete( selectedEntry )"
            class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg"
          >Delete</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if=" editingEntry "
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="editingEntry = null"
    >
      <div class="bg-gray-900 border border-white/20 rounded-2xl max-w-2xl w-full">
        <div class="p-6 border-b border-white/10">
          <h3 class="text-xl font-bold text-white">Edit Entry</h3>
        </div>
        <div class="p-6">
          <textarea
            v-model="editText"
            rows="10"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 resize-none"
          ></textarea>
        </div>
        <div class="p-6 border-t border-white/10 flex justify-end gap-3">
          <button
            @click="editingEntry = null"
            class="px-4 py-2 bg-white/10 hover:bg-white/20 text-purple-200 rounded-lg"
          >Cancel</button>
          <button
            @click="saveEdit"
            :disabled="journalStore.isSaving"
            class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
          >
            {{ journalStore.isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div
      v-if=" deletingEntry "
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="deletingEntry = null"
    >
      <div class="bg-gray-900 border border-white/20 rounded-2xl max-w-md w-full p-6 text-center">
        <div class="text-4xl mb-4">🗑️</div>
        <h3 class="text-xl font-bold text-white mb-2">Delete Entry?</h3>
        <p class="text-purple-300 mb-6">This action cannot be undone.</p>
        <div class="flex justify-center gap-3">
          <button
            @click="deletingEntry = null"
            class="px-6 py-2 bg-white/10 hover:bg-white/20 text-purple-200 rounded-lg"
          >Cancel</button>
          <button
            @click="executeDelete"
            class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useJournalStore } from '../../stores/journal'
import { principles } from '../../composables/useMathematics'
import ActivityCalendar from '../../components/ActivityCalendar.vue'
import HistoryTable from '../../components/HistoryTable.vue'

const journalStore = useJournalStore()

// UI state
const selectedEntry = ref( null )
const editingEntry = ref( null )
const editText = ref( '' )
const deletingEntry = ref( null )
const dateFilter = ref( null )

// Table columns
const columns = [
  { key: 'date', label: 'Date' },
  { key: 'math', label: 'Math' },
  { key: 'preview', label: 'Preview' },
  { key: 'actions', label: 'Actions', align: 'right' }
]

// Computed
const activityDates = computed( () => journalStore.entries.map( e => e.date ) )

const filteredEntries = computed( () => {
  if ( dateFilter.value ) return journalStore.entries.filter( e => e.date === dateFilter.value )
  return journalStore.entries
} )

// Helpers
const formatDate = ( dateStr ) => new Date( dateStr ).toLocaleDateString( 'en-US', { weekday: 'short', month: 'short', day: 'numeric' } )
const formatDisplayDate = ( dateStr ) => new Date( dateStr ).toLocaleDateString( 'en-US', { weekday: 'short', month: 'short', day: 'numeric' } )
const getPrincipleName = ( mathId ) => principles[parseInt( mathId )]?.name || ''

// Actions
const openDetail = ( entry ) => { selectedEntry.value = entry }
const openEdit = ( entry ) => { editingEntry.value = entry; editText.value = entry.entryText; selectedEntry.value = null }
const saveEdit = async () => {
  if ( !editText.value.trim() ) return
  await journalStore.updateEntry( editingEntry.value.id, { entryText: editText.value } )
  editingEntry.value = null
}
const confirmDelete = ( entry ) => { deletingEntry.value = entry; selectedEntry.value = null }
const executeDelete = async () => { await journalStore.deleteEntry( deletingEntry.value.id ); deletingEntry.value = null }

onMounted( () => journalStore.fetchEntries() )
</script>
