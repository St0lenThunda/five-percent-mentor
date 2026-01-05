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
            <span class="text-3xl">🅰️</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                Supreme Alphabet
              </h1>
              <p class="text-xs text-purple-200">The 26 Letters of Power</p>
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
          <h2 class="text-4xl font-bold text-white mb-4">The Supreme Alphabet</h2>
          <p class="text-xl text-purple-200 max-w-2xl mx-auto">
            From Allah (A) to Zig-Zag-Zig (Z), master the definitions that form the building blocks of the Universal
            Language.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for=" item in contentStore.alphabet "
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
                {{ item.letter }}
              </span>
            </div>

            <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
              {{ item.name }}
            </h3>

            <p class="text-purple-200 text-sm line-clamp-3 mb-4">
              {{ item.meaning }}
            </p>

            <!-- Optional Attributes Tag if present (JSON currently lacks it but good for future proofing) -->
            <div
              v-if=" item.attributes "
              class="flex flex-wrap gap-2"
            >
              <span
                v-for=" attr in item.attributes.slice( 0, 2 ) "
                :key="attr"
                class="px-2 py-1 text-xs rounded-md bg-white/5 text-purple-300 border border-white/5"
              >
                {{ attr }}
              </span>
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
                {{ selectedItem.letter }}
              </span>
            </div>
            <div>
              <h2 class="text-4xl font-bold text-white mb-1">{{ selectedItem.name }}</h2>
              <div
                v-if=" selectedItem.attributes "
                class="flex flex-wrap gap-2 mt-2"
              >
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

            <section
              v-if=" selectedItem.application "
              class="bg-white/5 rounded-2xl p-6 border border-white/5"
            >
              <h3 class="text-xl font-bold text-accent-400 mb-3 flex items-center gap-2">
                <span>⚡</span> Application
              </h3>
              <p class="text-lg text-purple-200 leading-relaxed italic">
                "{{ selectedItem.application }}"
              </p>
            </section>
          </div>

          <div class="mt-10 pt-8 border-t border-white/10 flex justify-between items-center">
            <div class="text-sm text-purple-400">
              Supreme Alphabet • {{ selectedItem.letter }}
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '../../stores/content'
import { useProgressStore } from '../../stores/progress'

const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()
const progressStore = useProgressStore()

const selectedItem = ref( null )

const openDetail = ( item ) => {
  selectedItem.value = item
  // Update URL with query param for deep linking
  router.replace( { query: { open: item.letter } } )
}

const closeDetail = () => {
  selectedItem.value = null
  // Clear query param when closing
  router.replace( { query: {} } )
}

const toggleComplete = async ( item ) => {
  if ( progressStore.isCompleted( item.id ) ) return
  await progressStore.markComplete( item.id, 'alphabet', 100 )
}

onMounted( async () => {
  await contentStore.fetchAllContent()
  await progressStore.fetchUserProgress()

  // Check for query param to auto-open detail
  const openLetter = route.query.open
  if ( openLetter ) {
    const item = contentStore.getLetterByChar( openLetter )
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
