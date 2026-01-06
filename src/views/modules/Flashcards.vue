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
            <span class="text-3xl">🎴</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                Flashcards
              </h1>
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

    <main class="container mx-auto px-6 py-12">
      <!-- Loading -->
      <div
        v-if=" contentStore.isLoading "
        class="flex justify-center py-20"
      >
        <div class="animate-spin text-4xl">🌀</div>
      </div>

      <!-- Mode Selection -->
      <div
        v-else-if=" !activeMode "
        class="max-w-4xl mx-auto"
      >
        <h2 class="text-4xl font-bold text-white mb-8 text-center">Choose Your Deck</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            @click="startDeck( 'mathematics' )"
            class="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-primary-500 hover:scale-[1.02] transition-all group text-left"
          >
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform w-fit">🔢</span>
            <h3 class="text-2xl font-bold text-white mb-2">Supreme Mathematics</h3>
            <p class="text-purple-200">Test your knowledge of the 10 degrees.</p>
          </button>

          <button
            @click="startDeck( 'alphabet' )"
            class="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-primary-500 hover:scale-[1.02] transition-all group text-left"
          >
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform w-fit">🅰️</span>
            <h3 class="text-2xl font-bold text-white mb-2">Supreme Alphabet</h3>
            <p class="text-purple-200">Test your knowledge of the 26 letters.</p>
          </button>

          <button
            @click="startDeck( 'jewels' )"
            class="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-gold-500 hover:scale-[1.02] transition-all group text-left"
          >
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform w-fit">💎</span>
            <h3 class="text-2xl font-bold text-white mb-2">12 Jewels</h3>
            <p class="text-purple-200">Master the 12 foundational principles.</p>
          </button>

          <button
            @click="startDeck( 'lessons' )"
            class="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-gold-500 hover:scale-[1.02] transition-all group text-left"
          >
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform w-fit">📖</span>
            <h3 class="text-2xl font-bold text-white mb-2">120 Lessons</h3>
            <p class="text-purple-200">Study the questions and answers.</p>
          </button>

          <button
            @click="startDeck( 'actualFacts' )"
            class="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-emerald-500 hover:scale-[1.02] transition-all group text-left"
          >
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform w-fit">🌍</span>
            <h3 class="text-2xl font-bold text-white mb-2">Actual Facts</h3>
            <p class="text-purple-200">13 facts about the planet Earth.</p>
          </button>

          <button
            @click="startDeck( 'solarFacts' )"
            class="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-yellow-500 hover:scale-[1.02] transition-all group text-left"
          >
            <span class="text-4xl mb-4 block group-hover:scale-110 transition-transform w-fit">☀️</span>
            <h3 class="text-2xl font-bold text-white mb-2">Solar Facts</h3>
            <p class="text-purple-200">9 planetary distances from the Sun.</p>
          </button>
        </div>
      </div>

      <!-- Flashcard View -->
      <div
        v-else
        class="max-w-2xl mx-auto flex flex-col items-center"
      >
        <div class="w-full flex justify-between items-center mb-6">
          <button
            @click="exitDeck"
            class="text-purple-300 hover:text-white"
          >← Change Deck</button>
          <span class="text-purple-300">{{ currentIndex + 1 }} / {{ currentDeck.length }}</span>
        </div>

        <div
          class="w-full aspect-[4/3] relative perspective-1000 cursor-pointer group"
          @click="isFlipped = !isFlipped"
        >
          <div
            class="w-full h-full relative preserve-3d transition-transform duration-500 rounded-3xl shadow-2xl"
            :class="{ 'rotate-y-180': isFlipped }"
          >
            <!-- Front -->
            <div
              class="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center"
            >
              <span class="text-purple-400 text-sm font-bold uppercase tracking-widest mb-4">
                {{ cardLabel }}
              </span>
              <span
                class="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gold-400 to-primary-500 mb-4"
              >
                {{ activeCard.front }}
              </span>
              <h3 class="text-3xl font-bold text-white">{{ activeCard.title }}</h3>
              <p class="mt-6 text-purple-200 opacity-50 text-sm">Tap to flip</p>
            </div>

            <!-- Back -->
            <div
              class="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-primary-900/40 to-gray-900 border border-primary-500/30 rounded-3xl flex flex-col items-center justify-center p-8 text-center"
            >
              <p class="text-xl text-purple-100 leading-relaxed">{{ activeCard.back }}</p>
            </div>
          </div>
        </div>

        <div class="flex gap-4 mt-8">
          <button
            @click="prevCard"
            class="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
            :disabled="currentIndex === 0"
            :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
          >
            Previous
          </button>
          <button
            @click="nextCard"
            class="px-8 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-lg transition-transform hover:scale-105"
            :disabled="currentIndex === currentDeck.length - 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentIndex === currentDeck.length - 1 }"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContentStore } from '../../stores/content'

const contentStore = useContentStore()
const activeMode = ref( null )
const currentIndex = ref( 0 )
const isFlipped = ref( false )

const currentDeck = computed( () => {
  if ( activeMode.value === 'mathematics' ) {
    return contentStore.mathematics.map( m => ( {
      front: m.number,
      title: m.name,
      back: m.meaning
    } ) )
  } else if ( activeMode.value === 'alphabet' ) {
    return contentStore.alphabet.map( a => ( {
      front: a.letter,
      title: a.name,
      back: a.meaning
    } ) )
  } else if ( activeMode.value === 'jewels' ) {
    return contentStore.jewels.map( j => ( {
      front: '💎',
      title: j.name,
      back: j.description
    } ) )
  } else if ( activeMode.value === 'lessons' ) {
    // Flatten all questions from all lesson sets
    const allQuestions = []
    contentStore.lessons.forEach( lesson => {
      if ( lesson.questions && lesson.questions.length > 0 ) {
        lesson.questions.forEach( q => {
          allQuestions.push( {
            front: '❓',
            title: q.question,
            back: q.answer
          } )
        } )
      }
    } )
    return allQuestions
  } else if ( activeMode.value === 'actualFacts' ) {
    return ( contentStore.actualFacts || [] ).map( f => ( {
      front: `#${f.number}`,
      title: f.question,
      back: f.answer
    } ) )
  } else if ( activeMode.value === 'solarFacts' ) {
    return ( contentStore.solarFacts || [] ).map( f => ( {
      front: f.number,
      title: f.planet,
      back: f.fact
    } ) )
  }
  return []
} )

const cardLabel = computed( () => {
  switch ( activeMode.value ) {
    case 'mathematics': return 'Degree'
    case 'alphabet': return 'Letter'
    case 'jewels': return 'Jewel'
    case 'lessons': return 'Question'
    case 'actualFacts': return 'Actual Fact'
    case 'solarFacts': return 'Solar Fact'
    default: return ''
  }
} )

const activeCard = computed( () => currentDeck.value[currentIndex.value] || {} )

const startDeck = ( mode ) => {
  activeMode.value = mode
  currentIndex.value = 0
  isFlipped.value = false
}

const exitDeck = () => {
  activeMode.value = null
  isFlipped.value = false
}

const nextCard = () => {
  if ( currentIndex.value < currentDeck.value.length - 1 ) {
    isFlipped.value = false
    setTimeout( () => currentIndex.value++, 150 ) // Wait for flip back
  }
}

const prevCard = () => {
  if ( currentIndex.value > 0 ) {
    isFlipped.value = false
    setTimeout( () => currentIndex.value--, 150 )
  }
}

onMounted( () => {
  contentStore.fetchAllContent()
} )
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
