<template>
  <div class="min-h-screen bg-[#050505] text-white overflow-hidden relative">
    <!-- Immersive Background Animations -->
    <div class="fixed inset-0 pointer-events-none opacity-20">
      <div
        class="absolute w-[800px] h-[800px] -top-1/4 -left-1/4 bg-primary-900/40 rounded-full blur-[120px] animate-pulse"
        :class="{ 'bg-gold-600/40': isBuildMode }"
      ></div>
      <div
        class="absolute w-[600px] h-[600px] -bottom-1/4 -right-1/4 bg-purple-900/30 rounded-full blur-[100px] animate-pulse-slow"
        :class="{ 'bg-gold-900/20': isBuildMode }"
      ></div>

      <!-- Build Mode Focal Vignette -->
      <transition name="fade">
        <div
          v-if=" isBuildMode "
          class="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-gold-950/40 mix-blend-overlay"
        ></div>
      </transition>

      <!-- Sacred Geometry Patterns -->
      <svg
        class="absolute inset-0 w-full h-full text-white/5 transition-colors duration-1000"
        :class="{ 'text-gold-500/10': isBuildMode }"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern
          id="grid"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="currentColor"
            stroke-width="0.5"
          />
        </pattern>
        <rect
          width="100%"
          height="100%"
          fill="url(#grid)"
        />
      </svg>
    </div>

    <!-- Header Section -->
    <header
      class="relative z-10 border-b border-white/5 backdrop-blur-md bg-black/40 transition-all duration-1000"
      :class="{ 'border-gold-500/20 bg-gold-950/20': isBuildMode }"
    >
      <div class="container mx-auto px-6 py-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-6">
            <router-link
              to="/"
              class="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
            >
              <span class="text-2xl">←</span>
            </router-link>
            <div>
              <h1
                class="text-4xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent transition-all duration-1000"
                :class="{ 'to-gold-400': isBuildMode }"
              >
                ATTRIBUTE BUILDER
              </h1>
              <p
                class="text-xs font-mono text-primary-400 uppercase tracking-[0.3em] flex items-center gap-2 mt-1 transition-colors duration-1000"
                :class="{ 'text-gold-400': isBuildMode }"
              >
                {{ isBuildMode ? 'Solidifying the Cipher' : 'Refining the Divine Mind' }}
                <span
                  class="w-1 h-1 rounded-full bg-primary-500 animate-ping"
                  :class="{ 'bg-gold-500': isBuildMode }"
                ></span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="relative group">
              <input
                v-model="search"
                type="text"
                placeholder="Search Attributes..."
                class="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 pl-12 focus:outline-none focus:border-primary-500/50 w-full md:w-64 transition-all"
              />
              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity"
              >🔍</span>
            </div>
            <button
              @click="toggleMode"
              class="px-6 py-3 bg-primary-500 border border-primary-400 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20"
              :class="{ 'bg-gold-600 border-gold-400 shadow-gold-500/20': isBuildMode }"
            >
              <span>{{ isBuildMode ? 'BUILD MODE' : 'EXPLORE MODE' }}</span>
              <div class="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"></div>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 container mx-auto px-6 py-12">
      <!-- Welcome Intro -->
      <div class="max-w-3xl mb-16">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-3">
          <span
            class="w-8 h-[1px] bg-primary-500"
            :class="{ 'bg-gold-500': isBuildMode }"
          ></span>
          {{ isBuildMode ? 'The Power of Consistency' : 'The Science of Refinement' }}
        </h2>
        <p class="text-purple-200/70 text-lg leading-relaxed">
          {{ isBuildMode ? 'Build mode is where we manifest our internal state. Select an attribute to increase your consistency in that area of life.' : 'Mastering the Attributes is the practice of aligning the human mind with its original nature. In the cycle of 1 to 9, we take the Knowledge of these principles and manifest them through Wisdom and Understanding.' }}
        </p>
      </div>

      <!-- Attributes Grid -->
      <transition-group
        name="list"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AttributeCard
          v-for=" ( attr, index ) in filteredAttributes "
          :key="attr.id"
          :attribute="attr"
          :index="index"
          :buildLevel="buildLevels[attr.id]?.level || 0"
          :isBuilding="buildLevels[attr.id]?.isBuilding || false"
          @select="selectAttribute"
        />
      </transition-group>

      <!-- Empty State -->
      <div
        v-if=" filteredAttributes.length === 0 "
        class="py-20 text-center"
      >
        <div class="text-6xl mb-6 grayscale opacity-30">⭐</div>
        <h3 class="text-xl font-bold text-white/50">No attributes found in this cipher.</h3>
        <p class="text-sm text-purple-400 mt-2">Try clarifying your knowledge search.</p>
      </div>
    </main>

    <!-- Detailed Modal Overlay -->
    <transition name="fade">
      <div
        v-if=" selected "
        class="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80"
      >
        <div
          class="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          @click.stop
        >
          <!-- Left Visual Side -->
          <div
            class="md:w-1/3 p-12 flex flex-col items-center justify-center relative overflow-hidden text-center transition-all duration-1000"
            :class="isBuildMode ? 'bg-gradient-to-br from-gold-600 to-amber-900' : 'bg-gradient-to-br from-primary-600 to-purple-900'"
          >
            <div class="absolute inset-0 opacity-10">
              <svg
                width="100%"
                height="100%"
              >
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#grid)"
                />
              </svg>
            </div>
            <div class="text-7xl font-black text-white mb-6 drop-shadow-2xl z-10">{{ selected.name }}</div>
            <div class="text-lg uppercase tracking-widest text-white/80 z-10">{{ selected.meaning }}</div>

            <div class="mt-12 flex flex-col items-center gap-4 z-10">
              <div class="text-[10px] font-bold tracking-[0.4em] opacity-40 uppercase">Building Status</div>
              <div
                v-if=" buildLevels[selected.id]?.isBuilding "
                class="px-4 py-1.5 bg-green-500/20 rounded-full border border-green-500/50 text-[10px] font-black text-green-400 tracking-widest uppercase animate-pulse"
              >
                CURRENT FOCUS
              </div>
              <button
                v-else-if=" isBuildMode "
                @click="attributesStore.setBuilding( selected.id )"
                class="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full border border-white/30 text-[10px] font-black tracking-widest uppercase transition-all"
              >
                Focus on this Attribute
              </button>

              <div class="text-[10px] font-bold tracking-[0.4em] opacity-40 uppercase mt-4">Consistency Level</div>
              <div class="flex gap-1.5">
                <div
                  v-for=" n in 10 "
                  :key="n"
                  class="w-2 h-2 rounded-full border border-white/20 transition-all duration-500"
                  :class="{
                    'bg-white scale-125 shadow-[0_0_10px_white]': n <= ( buildLevels[selected.id] || 0 ),
                    'opacity-20': n > ( buildLevels[selected.id] || 0 )
                  }"
                ></div>
              </div>
              <div
                class="px-4 py-1.5 bg-white/20 rounded-full border border-white/30 text-[10px] font-black tracking-widest uppercase"
              >
                {{ ( buildLevels[selected.id] || 0 ) * 10 }}% MANIFESTED
              </div>
            </div>
          </div>

          <!-- Right Content Side -->
          <div class="md:w-2/3 p-12 overflow-y-auto max-h-[80vh] custom-scrollbar bg-slate-900/40 backdrop-blur-xl">
            <div class="mb-12">
              <div
                class="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 transition-colors duration-1000"
                :class="isBuildMode ? 'text-gold-400' : 'text-primary-400'"
              >
                <span
                  class="w-2 h-2 rounded-full animate-pulse"
                  :class="isBuildMode ? 'bg-gold-500' : 'bg-primary-500'"
                ></span>
                The Power (5)
              </div>
              <p class="text-2xl font-bold text-white leading-snug">
                {{ selected.power }}
              </p>
            </div>

            <div class="mb-12">
              <div
                class="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 transition-colors duration-1000"
                :class="isBuildMode ? 'text-amber-400' : 'text-purple-400'"
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="isBuildMode ? 'bg-amber-500' : 'bg-purple-500'"
                ></span>
                The Refinement (5)
              </div>
              <p class="text-lg text-purple-100/80 leading-relaxed italic border-l-2 border-white/5 pl-6">
                "{{ selected.refinement }}"
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4 pt-8 border-t border-white/5">
              <button
                v-if=" isBuildMode "
                @click="buildAttribute( selected )"
                class="flex-1 px-8 py-4 bg-gold-600 hover:bg-gold-500 rounded-2xl font-black text-white transition-all transform active:scale-95 shadow-lg shadow-gold-500/20 group/build"
              >
                <span class="flex items-center justify-center gap-3">
                  BUILD CONSISTENCY
                  <span class="text-xl group-hover/build:rotate-90 transition-transform">⚡</span>
                </span>
              </button>
              <button
                @click="selected = null"
                class="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-purple-200 transition-all flex-1 md:flex-initial"
              >
                {{ isBuildMode ? 'CONTINUE EXPLORING' : 'CLOSE' }}
              </button>
            </div>
          </div>

          <!-- Close Icon -->
          <button
            @click="selected = null"
            class="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 hover:bg-white/10 flex items-center justify-center transition-colors group"
          >
            <span class="text-xl group-hover:rotate-90 transition-transform">✕</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AttributeCard from '../../components/AttributeCard.vue'
import { useAttributesStore } from '../../stores/attributes'

const attributesStore = useAttributesStore()
const search = ref( '' )
const selected = ref( null )
const isBuildMode = ref( false )

onMounted( async () => {
  await attributesStore.fetchAttributes()
} )

const attributes = computed( () => attributesStore.staticAttributes )
const buildLevels = computed( () => attributesStore.attributeProgress )

const filteredAttributes = computed( () => {
  return attributes.value.filter( a =>
    a.name.toLowerCase().includes( search.value.toLowerCase() ) ||
    a.meaning.toLowerCase().includes( search.value.toLowerCase() )
  )
} )

const selectAttribute = ( attr ) => {
  selected.value = attr
}

const toggleMode = () => {
  isBuildMode.value = !isBuildMode.value
  selected.value = null
}

const buildAttribute = async ( attr ) => {
  await attributesStore.growAttribute( attr.id )

  // Close the modal briefly for feedback flow
  setTimeout( () => {
    selected.value = null
  }, 1000 )
}
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.3);
  border-radius: 10px;
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.perspective-1000 {
  perspective: 1000px;
}
</style>
