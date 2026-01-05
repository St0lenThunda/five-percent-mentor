<template>
  <div
    v-if=" isOpen "
    class="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-12"
  >
    <!-- Backdrop -->
    <div
      @click="close"
      class="absolute inset-0 bg-black/80 backdrop-blur-sm"
    ></div>

    <!-- Modal Content -->
    <div
      class="relative w-full max-w-7xl max-h-full bg-slate-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
    >
      <!-- Header -->
      <div class="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
        <div class="flex items-center gap-4">
          <div
            v-if=" iaId && !loading "
            class="w-12 h-16 rounded-lg overflow-hidden border border-white/10 hidden sm:block flex-shrink-0 bg-slate-800"
          >
            <img
              :src="`https://archive.org/services/img/${iaId}`"
              class="w-full h-full object-cover"
              :alt="title"
            />
          </div>
          <span
            v-else
            class="text-3xl"
          >{{ icon }}</span>
          <div>
            <h2 class="text-xl font-bold text-white">{{ title }}</h2>
            <p class="text-xs text-purple-400 font-mono">
              {{ author }} • <span class="uppercase">{{ type }}</span>
              <span
                v-if=" iaMetadata?.date "
                class="ml-2"
              >• {{ iaMetadata.date }}</span>
            </p>
          </div>
        </div>
        <button
          @click="close"
          class="p-2 hover:bg-white/5 rounded-xl text-purple-300 transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-grow overflow-y-auto p-4 sm:p-8 custom-scrollbar scroll-smooth">
        <!-- Loading State -->
        <div
          v-if=" loading "
          class="flex flex-col items-center justify-center py-20 pointer-events-none"
        >
          <div class="animate-spin text-5xl mb-4">🌀</div>
          <p class="text-purple-300 animate-pulse">Gathering wisdom...</p>
        </div>

        <!-- Error State -->
        <div
          v-else-if=" error "
          class="text-center py-20"
        >
          <span class="text-5xl mb-4 block">⚠️</span>
          <h3 class="text-xl font-bold text-white mb-2">Resource Not Found</h3>
          <p class="text-purple-300">{{ error }}</p>
        </div>

        <!-- Media Rendering -->
        <div
          v-else
          class="w-full"
        >
          <!-- Header for Media/Context -->
          <div :class="{ 'grid grid-cols-1 lg:grid-cols-2 gap-8': showFullBook && type === 'book' }">
            <div :class="{ 'space-y-6': true }">
              <!-- Video / Documentary Frame -->
              <div
                v-if=" type === 'video' || type === 'documentary' "
                class="w-full mb-6"
              >
                <div class="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/5 shadow-2xl">
                  <iframe
                    v-if=" embedUrl "
                    :src="embedUrl"
                    class="w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                  <div
                    v-else
                    class="w-full h-full flex flex-col items-center justify-center text-purple-400"
                  >
                    <span class="text-4xl mb-2">🎞️</span>
                    <p>No video source available</p>
                  </div>
                </div>

                <div
                  v-if=" embedUrl && ( embedUrl.includes( 'youtube' ) || embedUrl.includes( 'youtu.be' ) ) "
                  class="mt-4 flex justify-center"
                >
                  <a
                    :href="embedUrl.replace( '/embed/', '/watch?v=' )"
                    target="_blank"
                    class="text-xs text-purple-400 hover:text-white flex items-center gap-2 transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
                  >
                    <span>External Link: View on YouTube</span>
                    <svg
                      class="w-3 h-3"
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
                  </a>
                </div>
              </div>

              <!-- Podcast / Audio Frame -->
              <div
                v-if=" type === 'podcast' "
                class="w-full mb-8"
              >
                <div
                  v-if=" formattedMediaUrl "
                  class="w-full rounded-2xl overflow-hidden border border-white/5 shadow-xl bg-black/20"
                >
                  <!-- Spotify / SoundCloud -->
                  <iframe
                    v-if=" formattedMediaUrl.includes( 'spotify' ) || formattedMediaUrl.includes( 'soundcloud' ) "
                    :src="formattedMediaUrl"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowfullscreen=""
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  >
                  </iframe>
                  <!-- YouTube -->
                  <div
                    v-else-if=" formattedMediaUrl.includes( 'youtube' ) || formattedMediaUrl.includes( 'youtu.be' ) "
                    class="aspect-video w-full"
                  >
                    <iframe
                      :src="formattedMediaUrl"
                      class="w-full h-full"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div>
                  <!-- Generic Audio -->
                  <div
                    v-else-if=" formattedMediaUrl.match( /\.(mp3|wav|ogg|m4a)$/i ) "
                    class="p-12 text-center"
                  >
                    <p class="text-purple-300 mb-6 font-medium">Audio stream detected</p>
                    <audio
                      :src="formattedMediaUrl"
                      controls
                      class="w-full max-w-lg mx-auto"
                    ></audio>
                  </div>
                  <!-- External Service Fallback (Apple Podcasts, etc.) -->
                  <div
                    v-else
                    class="p-16 text-center flex flex-col items-center gap-6"
                  >
                    <div class="text-6xl animate-pulse">🎙️</div>
                    <div>
                      <h3 class="text-xl font-bold mb-2">External Podcast Stream</h3>
                      <p class="text-sm text-purple-300 max-w-xs mx-auto">This podcast is hosted on an external platform
                        that requires direct access.</p>
                    </div>
                    <a
                      :href="embedUrl"
                      target="_blank"
                      class="px-8 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-bold transition-all flex items-center gap-2"
                    >
                      <span>Listen on Source</span>
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
                    </a>
                  </div>
                </div>
              </div>

              <!-- Article Frame -->
              <div
                v-if=" type === 'article' "
                class="w-full mb-8"
              >
                <div
                  class="p-12 bg-black/40 rounded-3xl border border-white/5 text-center flex flex-col items-center gap-6"
                >
                  <div class="text-6xl">📰</div>
                  <div>
                    <h3 class="text-2xl font-bold mb-2">Detailed Article Content</h3>
                    <p class="text-purple-300 max-w-md mx-auto">This resource is best read directly on the source
                      website to
                      preserve formatting and interactivity.</p>
                  </div>
                  <a
                    :href="embedUrl"
                    target="_blank"
                    class="px-8 py-4 bg-primary-500 hover:bg-primary-600 rounded-2xl text-white font-bold transition-all flex items-center gap-3"
                  >
                    <span>Read Original Article</span>
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <!-- Book Preview / Activate UI -->
              <div
                v-if=" type === 'book' && formattedBookUrl && !showFullBook "
                class="w-full mb-8"
              >
                <div
                  class="p-12 bg-slate-800/40 rounded-3xl border border-white/5 text-center flex flex-col items-center gap-6"
                >
                  <div class="text-6xl drop-shadow-glow">📖</div>
                  <div>
                    <h4 class="text-xl font-bold text-white mb-2">Primary Source Document</h4>
                    <p class="text-purple-300 max-w-sm mx-auto text-sm leading-relaxed">The original full-text version
                      of this work is available for deep research and verification.</p>
                  </div>
                  <button
                    @click="showFullBook = true"
                    class="px-8 py-3 bg-primary-500 hover:bg-primary-600 rounded-2xl text-white font-bold transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3"
                  >
                    <span>Activate Reader</span>
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Markdown Content -->
              <div
                v-if=" renderedContent "
                class="prose prose-invert prose-purple max-w-none prose-headings:text-white prose-p:text-purple-100 prose-strong:text-primary-400 prose-code:text-gold-400 prose-ul:list-disc markdown-content"
                v-html="renderedContent"
              ></div>
            </div>

            <!-- Side Reader Column -->
            <div
              v-if=" type === 'book' && formattedBookUrl && showFullBook "
              class="flex flex-col gap-4"
            >
              <div class="flex items-center justify-between px-2">
                <h3 class="text-sm font-bold text-purple-400 uppercase tracking-widest">Digital Archive Explorer</h3>
                <button
                  @click="showFullBook = false"
                  class="text-xs px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-purple-200 transition-all font-mono"
                >
                  HIDE READER
                </button>
              </div>

              <div
                class="w-full h-[600px] lg:h-[800px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
              >
                <iframe
                  :src="formattedBookUrl"
                  class="w-full h-full"
                  frameborder="0"
                  webkitallowfullscreen="true"
                  mozallowfullscreen="true"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-white/10 bg-black/20 flex justify-end">
        <button
          @click="close"
          class="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all"
        >
          Close Viewer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { marked } from 'marked'

const props = defineProps( {
  isOpen: Boolean,
  title: String,
  author: String,
  type: String,
  icon: String,
  localPath: String,
  embedUrl: String,
  pdfUrl: String,
  iaId: String
} )

const emit = defineEmits( ['close'] )

const renderedContent = ref( '' )
const loading = ref( false )
const error = ref( null )
const showFullBook = ref( false )
const iaMetadata = ref( null )

const formattedBookUrl = computed( () => {
  // 1. Priority: Internet Archive specific ID
  if ( props.iaId ) {
    return `https://archive.org/embed/${props.iaId}`
  }

  // 2. Fallback: Direct PDF/Doc URL
  if ( !props.pdfUrl ) return ''
  let url = props.pdfUrl

  // Handle Archive.org details links in pdfUrl
  if ( url.includes( 'archive.org/details/' ) ) {
    return url.replace( 'archive.org/details/', 'archive.org/embed/' )
  }

  // Handle Google Drive file links
  if ( url.includes( 'drive.google.com/file/d/' ) ) {
    return url.replace( '/view', '/preview' ).replace( '/edit', '/preview' );
  }

  // 3. Final Fallback: Return raw URL for direct iframe attempt
  return url
} )

const formattedMediaUrl = computed( () => {
  if ( !props.embedUrl ) return ''

  let url = props.embedUrl

  // Handle YouTube
  if ( url.includes( 'youtube.com/watch?v=' ) ) {
    const videoId = url.split( 'v=' )[1].split( '&' )[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  if ( url.includes( 'youtu.be/' ) ) {
    const videoId = url.split( 'youtu.be/' )[1].split( '?' )[0]
    return `https://www.youtube.com/embed/${videoId}`
  }

  // Handle SoundCloud (convert to widget URL if it's a standard link)
  if ( url.includes( 'soundcloud.com' ) && !url.includes( 'api.soundcloud.com' ) ) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent( url )}&color=%237c3aed&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`
  }

  return url
} )

const fetchIAMetadata = async () => {
  if ( !props.iaId ) {
    iaMetadata.value = null
    return
  }

  try {
    const response = await fetch( `https://archive.org/metadata/${props.iaId}` )
    if ( !response.ok ) throw new Error( 'IA Metadata not found' )
    const data = await response.json()
    iaMetadata.value = data.metadata
  } catch ( e ) {
    console.warn( 'IA Metadata fetch failed:', e )
    iaMetadata.value = null
  }
}

const fetchContent = async () => {
  if ( !props.localPath ) {
    renderedContent.value = ''
    return
  }

  loading.value = true
  error.value = null
  try {
    const response = await fetch( props.localPath )
    if ( !response.ok ) throw new Error( 'Could not load content.' )
    const text = await response.text()
    renderedContent.value = marked.parse( text )
  } catch ( e ) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

watch( () => props.isOpen, ( newVal ) => {
  if ( newVal ) {
    fetchContent()
    fetchIAMetadata()
    showFullBook.value = false
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
} )

const close = () => {
  emit( 'close' )
}
</script>

<style>
.markdown-content h1 {
  @apply text-3xl font-bold mb-6 mt-2 border-b border-white/10 pb-4;
}

.markdown-content h2 {
  @apply text-2xl font-bold mb-4 mt-8 text-purple-400;
}

.markdown-content h3 {
  @apply text-xl font-bold mb-2 mt-6 text-gold-400;
}

.markdown-content p {
  @apply text-lg leading-relaxed mb-4;
}

.markdown-content ul {
  @apply mb-6 pl-6;
}

.markdown-content li {
  @apply mb-2;
}

.markdown-content blockquote {
  @apply border-l-4 border-primary-500 pl-4 italic my-6 text-purple-200 bg-white/5 py-4 pr-4 rounded-r-xl;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-white/10 rounded-full hover:bg-white/20 transition-colors;
}
</style>
