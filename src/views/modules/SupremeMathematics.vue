<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0 z-40">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link
            to="/"
            class="flex items-center gap-3 group"
          >
            <span class="text-3xl">🔢</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                Supreme Mathematics
              </h1>
              <p class="text-xs text-purple-200">Knowledge → Wisdom → Understanding</p>
            </div>
          </router-link>
          <router-link
            to="/"
            class="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-colors text-purple-200 hover:text-white"
          >
            ← Dashboard
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-12">
      <!-- Loading State -->
      <div
        v-if=" contentStore.isLoading "
        class="flex justify-center py-20"
      >
        <div class="animate-spin text-4xl">🌀</div>
      </div>

      <!-- Error State -->
      <div
        v-else-if=" contentStore.error "
        class="text-center py-20"
      >
        <div class="text-red-400 text-xl mb-4">Error loading content</div>
        <p class="text-purple-200">{{ contentStore.error }}</p>
        <button
          @click="contentStore.fetchAllContent()"
          class="mt-6 px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Content Grid -->
      <div
        v-else
        class="max-w-6xl mx-auto"
      >
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-4">The Universal Language</h2>
          <p class="text-xl text-purple-200 max-w-2xl mx-auto mb-8">
            Master the ten principles (0-9) to decode the universe and understand the nature of reality.
          </p>

          <!-- Search Filter -->
          <div class="max-w-md mx-auto relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by number, name, or meaning..."
              class="w-full px-5 py-3 pl-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300">🔍</span>
            <button
              v-if=" searchQuery "
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-purple-300 hover:text-white transition-colors"
              title="Clear search"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for=" item in filteredMathematics "
            :key="item.id"
            @click="openDetail( item )"
            class="group cursor-pointer backdrop-blur-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/50 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden"
          >
            <!-- Completion Badge -->
            <div
              v-if=" progressStore.isCompleted( item.id ) "
              class="absolute top-4 right-4 text-green-400 bg-green-400/10 px-2 py-1 rounded-full text-xs font-bold border border-green-400/20"
            >
              MASTERED
            </div>

            <div class="flex items-start gap-4 mb-4">
              <span
                class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gold-400 to-primary-500 group-hover:scale-110 transition-transform duration-300"
              >
                {{ item.number }}
              </span>
            </div>

            <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
              {{ item.name }}
            </h3>

            <p class="text-purple-200 text-sm line-clamp-3 mb-4">
              {{ item.meaning }}
            </p>

            <div class="flex flex-wrap gap-2">
              <span
                v-for=" attr in item.attributes.slice( 0, 2 ) "
                :key="attr"
                class="px-2 py-1 text-xs rounded-md bg-white/5 text-purple-300 border border-white/5"
              >
                {{ attr }}
              </span>
              <span
                v-if=" item.attributes.length > 2 "
                class="px-2 py-1 text-xs text-purple-400"
              >+{{ item.attributes.length - 2 }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Detail Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if=" selectedItem "
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/80 backdrop-blur-sm"
          @click="closeDetail"
        ></div>

        <!-- Modal Content -->
        <div
          class="relative bg-gray-900 border border-white/10 rounded-3xl max-w-2xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <button
            @click="closeDetail"
            class="absolute top-6 right-6 text-purple-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>

          <div class="flex items-center gap-6 mb-8">
            <div
              class="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold-400/20 to-primary-500/20 flex items-center justify-center border border-white/10"
            >
              <span
                class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gold-400 to-primary-500"
              >
                {{ selectedItem.number }}
              </span>
            </div>
            <div>
              <h2 class="text-4xl font-bold text-white mb-1">{{ selectedItem.name }}</h2>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for=" attr in selectedItem.attributes "
                  :key="attr"
                  class="px-3 py-1 rounded-full bg-white/10 text-purple-200 text-sm border border-white/10"
                >
                  {{ attr }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-8">
            <section>
              <h3 class="text-xl font-bold text-primary-400 mb-3 flex items-center gap-2">
                <span>📖</span> Meaning
              </h3>
              <p class="text-lg text-purple-100 leading-relaxed">
                {{ selectedItem.meaning }}
              </p>
            </section>

            <section class="bg-white/5 rounded-2xl p-6 border border-white/5">
              <h3 class="text-xl font-bold text-accent-400 mb-3 flex items-center gap-2">
                <span>⚡</span> Application
              </h3>
              <p class="text-lg text-purple-200 leading-relaxed italic">
                "{{ selectedItem.application }}"
              </p>
            </section>

            <!-- Break It Down Accordion -->
            <section class="border border-white/10 rounded-2xl overflow-hidden">
              <button
                @click="showBreakdown = !showBreakdown"
                class="w-full px-6 py-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors text-left"
              >
                <span class="text-lg font-bold text-gold-400 flex items-center gap-2">
                  <span>🔍</span> Break It Down
                </span>
                <span
                  class="text-purple-300 transition-transform duration-300"
                  :class="{ 'rotate-180': showBreakdown }"
                >▼</span>
              </button>

              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-[500px] opacity-100"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="max-h-[500px] opacity-100"
                leave-to-class="max-h-0 opacity-0"
              >
                <div
                  v-if=" showBreakdown "
                  class="px-6 py-4 space-y-6 bg-black/20 overflow-hidden"
                >
                  <!-- Numerology -->
                  <div>
                    <h4 class="text-sm font-bold text-purple-300 uppercase tracking-wider mb-2">Numerology</h4>
                    <p class="text-lg text-white">
                      {{ selectedItem.number }} + {{ selectedItem.number }} = {{ numerology?.doubled }}
                      <span
                        v-if=" numerology?.doubled >= 10 "
                        class="text-purple-400"
                      >
                        → {{ String( numerology?.doubled ).split( '' ).join( ' + ' ) }} =
                      </span>
                      <span class="text-gold-400 font-bold">{{ numerology?.reduced }}
                        ({{ numerology?.relatedMath?.name }})</span>
                    </p>
                  </div>

                  <!-- Related Alphabet -->
                  <div v-if=" correlatedAlphabet.length ">
                    <h4 class="text-sm font-bold text-purple-300 uppercase tracking-wider mb-2">Related Alphabet</h4>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for=" letter in correlatedAlphabet "
                        :key="letter.id"
                        @click="router.push( { path: '/supreme-alphabet', query: { open: letter.letter } } )"
                        class="px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-300 text-sm border border-primary-500/30 hover:bg-primary-500/30 hover:border-primary-500/50 cursor-pointer transition-colors"
                        :title="letter.meaning"
                      >
                        {{ letter.letter }} - {{ letter.name }}
                      </button>
                    </div>
                  </div>

                  <!-- Related Jewels -->
                  <div v-if=" correlatedJewels.length ">
                    <h4 class="text-sm font-bold text-purple-300 uppercase tracking-wider mb-2">Related Jewels</h4>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for=" jewel in correlatedJewels "
                        :key="jewel.id"
                        class="px-3 py-1.5 rounded-lg bg-gold-500/20 text-gold-300 text-sm border border-gold-500/30 cursor-default"
                        :title="jewel.description"
                      >
                        💎 {{ jewel.name }}
                      </span>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <p
                    v-if=" !correlatedAlphabet.length && !correlatedJewels.length "
                    class="text-purple-400 text-sm italic"
                  >
                    No direct correlations found. Explore the Alphabet and Jewels to discover connections.
                  </p>
                </div>
              </Transition>
            </section>
          </div>

          <div class="mt-10 pt-8 border-t border-white/10 flex justify-between items-center">
            <div class="text-sm text-purple-400">
              Supreme Mathematics • Degree {{ selectedItem.number }}
            </div>

            <button
              @click="toggleComplete( selectedItem )"
              class="px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2"
              :class="progressStore.isCompleted( selectedItem.id )
                ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-primary-500/25'"
            >
              <span v-if=" progressStore.isCompleted( selectedItem.id ) ">✓ Mastered</span>
              <span v-else>Mark as Mastered</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '../../stores/content'
import { useProgressStore } from '../../stores/progress'

const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()
const progressStore = useProgressStore()

const selectedItem = ref( null )
const searchQuery = ref( '' )
const showBreakdown = ref( false )

const filteredMathematics = computed( () => {
  if ( !searchQuery.value.trim() ) {
    return contentStore.mathematics
  }
  const query = searchQuery.value.toLowerCase()
  return contentStore.mathematics.filter( m =>
    String( m.number ).includes( query ) ||
    m.name.toLowerCase().includes( query ) ||
    m.meaning.toLowerCase().includes( query )
  )
} )

// Dynamic Numerology
const numerology = computed( () => {
  if ( !selectedItem.value ) return null
  return contentStore.getNumerologyBreakdown( selectedItem.value.number )
} )

// Dynamic Correlations
const correlatedAlphabet = computed( () => {
  if ( !selectedItem.value ) return []
  return contentStore.getCorrelatedAlphabet( selectedItem.value.name )
} )

const correlatedJewels = computed( () => {
  if ( !selectedItem.value ) return []
  return contentStore.getCorrelatedJewels( selectedItem.value.name )
} )

const openDetail = ( item ) => {
  selectedItem.value = item
  // Update URL with query param for deep linking
  router.replace( { query: { open: item.number } } )
}

const closeDetail = () => {
  selectedItem.value = null
  // Clear query param when closing
  router.replace( { query: {} } )
}

const toggleComplete = async ( item ) => {
  if ( progressStore.isCompleted( item.id ) ) {
    // Ideally we would add 'unmark' logic but for now let's just allow marking
    // Or we could implement removeProgress in store if needed.
    // For this MVP, we only Mark.
    return
  }
  await progressStore.markComplete( item.id, 'mathematics', 100 )
}

onMounted( async () => {
  await contentStore.fetchAllContent()
  await progressStore.fetchUserProgress()

  // Check for query param to auto-open detail
  const openNum = route.query.open
  if ( openNum !== undefined ) {
    const item = contentStore.getMathByNumber( Number( openNum ) )
    if ( item ) {
      selectedItem.value = item
    }
  }
} )
</script>

<style scoped>
/* Scrollbar for modal content */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
