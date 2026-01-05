<template>
  <div class="min-h-screen pb-20">
    <!-- Header -->
    <header class="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0 z-40">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link
            to="/"
            class="flex items-center gap-3 group"
          >
            <span class="text-3xl">📚</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                Knowledge Library
              </h1>
              <p class="text-xs text-purple-300">Curated NGE Readings</p>
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
      <div
        v-if=" contentStore.isLoading "
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="animate-spin text-6xl mb-4">🌀</div>
        <p class="text-purple-300">Gathering wisdom...</p>
      </div>

      <div
        v-else
        class="max-w-6xl mx-auto"
      >
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-4">Required Reading</h2>
          <p class="text-lg text-purple-200 max-w-2xl mx-auto">
            Expand your cipher with these foundational and historical NGE texts.
          </p>
        </div>

        <!-- Search and Filter Bar -->
        <div class="mb-12 space-y-6">
          <div class="flex flex-col md:flex-row gap-4 mb-8">
            <div class="flex-grow relative group">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search Knowledge Library..."
                class="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                @keyup.enter="performGlobalSearch"
              />
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🔍</span>
              <button
                v-if=" searchQuery "
                @click="performGlobalSearch"
                :disabled="searchLoading"
                class="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-700 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2"
              >
                <span
                  v-if=" searchLoading "
                  class="animate-spin"
                >🌀</span>
                <span>{{ searchLoading ? 'Searching...' : 'Search Archive' }}</span>
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex flex-wrap justify-center gap-2">
              <span
                class="w-full text-center text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Categories</span>
              <button
                v-for=" cat in categories "
                :key="cat"
                @click="selectedCategory = cat"
                class="px-4 py-2 rounded-full text-sm font-bold transition-all border"
                :class="selectedCategory === cat
                  ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10 hover:border-white/20'"
              >
                {{ cat }}
              </button>
            </div>

            <div class="flex flex-wrap justify-center gap-2">
              <span class="w-full text-center text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Media
                Format</span>
              <button
                v-for=" type in mediaTypes "
                :key="type"
                @click="selectedMediaType = type"
                class="px-4 py-2 rounded-full text-sm font-bold transition-all border capitalize"
                :class="selectedMediaType === type
                  ? 'bg-gold-500 border-gold-500 text-white shadow-lg shadow-gold-500/25'
                  : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10 hover:border-white/20'"
              >
                {{ type }}
              </button>
            </div>
          </div>
        </div>

        <!-- Global Discovery Header -->
        <div
          v-if=" globalResults.length > 0 "
          class="mb-12"
        >
          <div class="flex items-center justify-between mb-6 px-4">
            <div class="flex items-center gap-3">
              <span class="text-3xl">🌐</span>
              <h2 class="text-2xl font-bold text-white uppercase tracking-tighter">Global Archive Discovery</h2>
            </div>
            <button
              @click="globalResults = []"
              class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-purple-400 hover:text-white transition-all"
            >
              CLEAR RESULTS
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div
              v-for=" item in globalResults "
              :key="item.id"
              class="backdrop-blur-xl bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-8 hover:border-primary-500/40 transition-all duration-500 group relative overflow-hidden flex flex-col highlight-border"
            >
              <div class="flex items-start justify-between mb-6">
                <div
                  class="p-4 bg-primary-500/10 rounded-3xl text-3xl group-hover:scale-110 transition-transform duration-500"
                >
                  {{ getMediaIcon( item.type ) }}
                </div>
                <div class="flex flex-col items-end gap-1">
                  <span
                    class="text-[10px] uppercase font-black tracking-[0.2em] text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20"
                  >Archive IP</span>
                </div>
              </div>

              <h3 class="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight">{{ item.title }}</h3>
              <p class="text-[11px] text-purple-400 font-mono mb-6 flex items-center gap-2">
                <span class="opacity-30">BY</span> {{ item.author }}
              </p>

              <p
                class="text-sm text-purple-200/60 mb-8 line-clamp-3 leading-relaxed font-light italic bg-white/3 p-4 rounded-2xl border border-white/5">
                {{ item.description }}
              </p>

              <div class="mt-auto grid grid-cols-1 gap-3">
                <button
                  @click="openLocal( item )"
                  class="group/btn w-full py-4 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30 rounded-[1.5rem] text-primary-400 font-black transition-all text-xs tracking-widest flex items-center justify-center gap-3"
                >
                  <span>INSPECT METADATA</span>
                  <svg
                    class="w-4 h-4 group-hover/btn:rotate-12 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  @click="openPdf( item.pdfUrl )"
                  class="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] text-white/70 hover:text-white font-bold transition-all text-xs tracking-widest flex items-center justify-center gap-3"
                >
                  <span>LAUNCH ARCHIVE</span>
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12"></div>
        </div>

        <!-- Library Grid -->
        <div
          v-if=" filteredLibrary.length > 0 "
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div
            v-for=" ( book, index ) in filteredLibrary "
            :key="book.id"
            class="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-primary-500/50 transition-all duration-300 group flex flex-col h-full"
            :style="{ transitionDelay: `${index * 50}ms` }"
          >
            <div
              class="h-48 bg-gradient-to-br from-purple-900/40 to-black/40 rounded-2xl mb-6 flex items-center justify-center border border-white/5 group-hover:scale-[1.02] transition-transform relative overflow-hidden"
            >
              <div class="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span class="text-7xl group-hover:rotate-12 transition-transform duration-500">
                {{ getMediaIcon( book.type ) }}
              </span>
            </div>

            <div class="flex items-center gap-2 mb-3">
              <span
                class="px-3 py-1 bg-primary-500/20 border border-primary-500/30 text-[10px] font-black text-primary-400 uppercase tracking-tighter rounded-full"
              >
                {{ book.category }}
              </span>
              <span
                class="px-2 py-0.5 bg-white/5 border border-white/10 text-[9px] font-bold text-purple-400 uppercase rounded-md lowercase first-letter:uppercase"
              >
                {{ book.type }}
              </span>
            </div>

            <h3 class="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
              {{ book.title }}
            </h3>
            <p class="text-xs text-purple-400 mb-4 font-mono">by {{ book.author }}</p>

            <p class="text-purple-200 text-sm leading-relaxed mb-8 flex-grow">
              {{ book.description }}
            </p>

            <div class="flex flex-col gap-2 w-full mt-auto">
              <!-- Content Action (Summary / Audio / Video) -->
              <button
                v-if=" book.localPath || book.embedUrl "
                @click="openLocal( book )"
                class="w-full py-3 bg-primary-500 hover:bg-primary-600 border border-primary-500 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-primary-500/10"
              >
                <span>{{ getActionLabel( book.type ) }}</span>
              </button>

              <!-- PDF Action -->
              <button
                v-if=" book.pdfUrl "
                @click="openPdf( book.pdfUrl )"
                class="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-purple-200 hover:text-white font-bold transition-all flex items-center justify-center gap-2 group/btn text-sm"
              >
                <span class="text-lg">📖</span>
                <span>Read Full Text (PDF)</span>
              </button>

              <!-- External Action -->
              <button
                @click="openDetails( book )"
                class="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-purple-200/50 hover:text-white font-bold transition-all flex items-center justify-center gap-2 group/btn text-[10px]"
                :title="`Search online for ${book.title}`"
              >
                <span
                  class="opacity-50 group-hover/btn:opacity-100 transition-opacity flex items-center gap-1.5 uppercase tracking-widest"
                >
                  <span class="text-xs">🌐</span>
                  External Discovery
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="text-center py-20 bg-white/5 rounded-3xl border border-white/10"
        >
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-2xl font-bold text-white mb-2">No matching knowledge</h3>
          <p class="text-purple-300">Adjust your search or filter to find what you're looking for.</p>
        </div>
      </div>
    </main>

    <KnowledgeViewer
      :is-open="viewer.isOpen"
      :title="viewer.title"
      :author="viewer.author"
      :type="viewer.type"
      :icon="getMediaIcon( viewer.type )"
      :local-path="viewer.localPath"
      :embed-url="viewer.embedUrl"
      :pdf-url="viewer.pdfUrl"
      :ia-id="viewer.iaId"
      @close="viewer.isOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '../../stores/content'
import KnowledgeViewer from '../../components/KnowledgeViewer.vue'

const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()
const searchQuery = ref( '' )
const selectedCategory = ref( 'All' )
const selectedMediaType = ref( 'All' )

const viewer = reactive( {
  isOpen: false,
  title: '',
  author: '',
  type: '',
  localPath: '',
  embedUrl: '',
  pdfUrl: '',
  iaId: ''
} )

const isGlobalSearch = ref( false )
const globalResults = ref( [] )
const searchLoading = ref( false )

const categories = computed( () => {
  const cats = ['All', ...new Set( contentStore.library.map( b => b.category ) )]
  return cats
} )

const mediaTypes = ['All', 'book', 'video', 'podcast', 'documentary', 'article']

const filteredLibrary = computed( () => {
  return contentStore.library.filter( book => {
    const matchesSearch = book.title.toLowerCase().includes( searchQuery.value.toLowerCase() ) ||
      book.author.toLowerCase().includes( searchQuery.value.toLowerCase() ) ||
      book.description.toLowerCase().includes( searchQuery.value.toLowerCase() )

    const matchesCategory = selectedCategory.value === 'All' || book.category === selectedCategory.value
    const matchesMedia = selectedMediaType.value === 'All' || book.type === selectedMediaType.value

    return matchesSearch && matchesCategory && matchesMedia
  } )
} )

const openDetails = ( book ) => {
  const query = encodeURIComponent( `${book.title} ${book.author} ${book.type}` )
  window.open( `https://www.google.com/search?q=${query}`, '_blank' )
}

const openLocal = ( book ) => {
  viewer.title = book.title
  viewer.author = book.author
  viewer.type = book.type
  viewer.localPath = book.localPath || ''
  viewer.embedUrl = book.embedUrl || ''
  viewer.pdfUrl = book.pdfUrl || ''
  viewer.iaId = book.ia_id || ''
  viewer.isOpen = true
  // Update URL with query param for deep linking
  router.replace( { query: { open: book.id } } )
}

const closeViewer = () => {
  viewer.isOpen = false
  // Clear query param when closing
  router.replace( { query: {} } )
}

const globalSearch = async () => {
  if ( !searchQuery.value.trim() ) return

  searchLoading.value = true
  isGlobalSearch.value = true

  try {
    // Subject query for high quality NGE results
    const query = `(subject:"nation of gods and earths" OR subject:"five percenters") AND (title:${searchQuery.value} OR creator:${searchQuery.value})`
    const response = await fetch( `https://archive.org/advancedsearch.php?q=${encodeURIComponent( query )}&fl[]=identifier,title,creator,description,mediatype,date&output=json&rows=10` )
    const data = await response.json()

    globalResults.value = data.response.docs.map( doc => ( {
      id: doc.identifier,
      type: doc.mediatype === 'texts' ? 'book' : 'documentary',
      title: doc.title,
      author: doc.creator || 'Archive Contributor',
      category: 'Global Archive',
      description: doc.description || 'No description available.',
      ia_id: doc.identifier,
      pdfUrl: `https://archive.org/details/${doc.identifier}`
    } ) )
  } catch ( e ) {
    console.error( 'Global search failed:', e )
    globalResults.value = []
  } finally {
    searchLoading.value = false
  }
}

const openPdf = ( url ) => {
  window.open( url, '_blank' )
}

const getActionLabel = ( type ) => {
  switch ( type ) {
    case 'video':
    case 'documentary':
      return 'Watch Locally'
    case 'podcast':
      return 'Listen Locally'
    case 'article':
      return 'Read Article'
    default:
      return 'Read Locally'
  }
}

const getMediaIcon = ( type ) => {
  switch ( type ) {
    case 'video': return '📽️'
    case 'podcast': return '🎙️'
    case 'documentary': return '🎬'
    case 'article': return '📰'
    default: return '📖'
  }
}

onMounted( async () => {
  await contentStore.fetchAllContent()

  // Check for query param to auto-open viewer
  const openId = route.query.open
  if ( openId ) {
    const item = contentStore.library.find( lib => lib.id === openId )
    if ( item ) {
      openLocal( item )
    }
  }
} )
</script>
