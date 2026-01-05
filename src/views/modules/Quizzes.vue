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
            <span class="text-3xl">🎯</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                Knowledge Quiz
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

      <!-- Settings Menu -->
      <div
        v-else-if=" gameState === 'menu' "
        class="max-w-4xl mx-auto"
      >
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-4">Customize Your Cipher</h2>
          <p class="text-purple-200">Select topics and difficulty to build.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white/5 p-8 rounded-3xl border border-white/10">

          <!-- Topic Selection -->
          <div class="space-y-6">
            <h3 class="text-xl font-bold text-white border-b border-white/10 pb-2">Select Topics</h3>

            <label class="flex items-center gap-4 cursor-pointer group">
              <div
                class="w-6 h-6 rounded border flex items-center justify-center transition-colors"
                :class="settings.topics.includes( 'math' ) ? 'bg-primary-500 border-primary-500' : 'border-white/30 group-hover:border-white/50'"
              >
                <span
                  v-if=" settings.topics.includes( 'math' ) "
                  class="text-white text-sm"
                >✓</span>
              </div>
              <input
                type="checkbox"
                value="math"
                v-model="settings.topics"
                class="hidden"
              >
              <span class="text-lg text-white">Supreme Mathematics</span>
            </label>

            <label class="flex items-center gap-4 cursor-pointer group">
              <div
                class="w-6 h-6 rounded border flex items-center justify-center transition-colors"
                :class="settings.topics.includes( 'alphabet' ) ? 'bg-gold-500 border-gold-500' : 'border-white/30 group-hover:border-white/50'"
              >
                <span
                  v-if=" settings.topics.includes( 'alphabet' ) "
                  class="text-black text-sm font-bold"
                >✓</span>
              </div>
              <input
                type="checkbox"
                value="alphabet"
                v-model="settings.topics"
                class="hidden"
              >
              <span class="text-lg text-white">Supreme Alphabet</span>
            </label>

            <label class="flex items-center gap-4 cursor-pointer group opacity-90 hover:opacity-100">
              <div
                class="w-6 h-6 rounded border flex items-center justify-center transition-colors"
                :class="settings.topics.includes( 'jewels' ) ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 group-hover:border-white/50'"
              >
                <span
                  v-if=" settings.topics.includes( 'jewels' ) "
                  class="text-white text-sm"
                >✓</span>
              </div>
              <input
                type="checkbox"
                value="jewels"
                v-model="settings.topics"
                class="hidden"
              >
              <span class="text-lg text-white">12 Jewels</span>
            </label>

            <label class="flex items-center gap-4 cursor-pointer group opacity-90 hover:opacity-100">
              <div
                class="w-6 h-6 rounded border flex items-center justify-center transition-colors"
                :class="settings.topics.includes( 'lessons' ) ? 'bg-blue-500 border-blue-500' : 'border-white/30 group-hover:border-white/50'"
              >
                <span
                  v-if=" settings.topics.includes( 'lessons' ) "
                  class="text-white text-sm"
                >✓</span>
              </div>
              <input
                type="checkbox"
                value="lessons"
                v-model="settings.topics"
                class="hidden"
              >
              <span class="text-lg text-white">120 Lessons</span>
            </label>
          </div>

          <!-- Question Count -->
          <div class="space-y-6">
            <h3 class="text-xl font-bold text-white border-b border-white/10 pb-2">Number of Questions</h3>
            <div class="flex gap-4">
              <button
                v-for=" count in [5, 10, 20, 50] "
                :key="count"
                @click="settings.count = count"
                class="flex-1 py-3 rounded-xl border transition-all"
                :class="settings.count === count ? 'bg-white text-black font-bold border-white' : 'bg-white/5 text-purple-200 border-white/10 hover:bg-white/10'"
              >
                {{ count }}
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 text-center">
          <button
            @click="startQuiz"
            :disabled="settings.topics.length === 0"
            class="px-12 py-4 bg-gradient-to-r from-gold-500 to-primary-500 text-white font-bold rounded-2xl text-xl shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Building
          </button>
          <p
            v-if=" settings.topics.length === 0 "
            class="text-red-400 mt-2 text-sm"
          >Select at least one topic.</p>
        </div>
      </div>

      <!-- Quiz View -->
      <div
        v-else-if=" gameState === 'playing' "
        class="max-w-2xl mx-auto"
      >
        <div class="flex justify-between items-center mb-8">
          <div class="text-sm text-purple-300">Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</div>
          <div class="text-sm font-bold text-gold-400">Score: {{ score }}</div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-2 bg-white/10 rounded-full mb-8 overflow-hidden">
          <div
            class="h-full bg-primary-500 transition-all duration-300"
            :style="{ width: `${( currentQuestionIndex / totalQuestions ) * 100}%` }"
          ></div>
        </div>

        <div class="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
          <div class="mb-4">
            <span
              class="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-purple-200 border border-white/5"
            >
              {{ currentQuestion.topicLabel }}
            </span>
          </div>

          <h3 class="text-2xl font-bold text-white mb-6 text-center leading-relaxed">
            {{ currentQuestion.text }}
          </h3>

          <div class="space-y-4">
            <button
              v-for=" option in currentQuestion.options "
              :key="option"
              @click="handleAnswer( option )"
              :disabled="showFeedback"
              class="w-full p-4 rounded-xl border transition-all duration-200 text-left font-semibold relative overflow-hidden"
              :class="getOptionClass( option )"
            >
              {{ option }}
              <span
                v-if=" showFeedback && option === currentQuestion.correct "
                class="absolute right-4 text-green-400"
              >✓</span>
              <span
                v-if=" showFeedback && option === selectedAnswer && option !== currentQuestion.correct "
                class="absolute right-4 text-red-400"
              >✗</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Results View -->
      <div
        v-else-if=" gameState === 'results' "
        class="max-w-lg mx-auto text-center"
      >
        <div class="text-8xl mb-6">🏆</div>
        <h2 class="text-4xl font-bold text-white mb-2">Cipher Complete!</h2>
        <p class="text-purple-200 mb-8">You scored {{ score }} out of {{ totalQuestions }}</p>

        <div class="backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
          <div
            class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gold-400 to-primary-500 mb-2"
          >
            {{ Math.round( ( score / totalQuestions ) * 100 ) }}%
          </div>
          <p class="text-sm text-purple-300">Mastery Level</p>
        </div>

        <div class="flex gap-4 justify-center">
          <button
            @click="gameState = 'menu'"
            class="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/10"
          >
            New Settings
          </button>
          <button
            @click="startQuiz"
            class="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary-500/25"
          >
            Replay Same Config
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useContentStore } from '../../stores/content'
import { useProgressStore } from '../../stores/progress'

const contentStore = useContentStore()
const progressStore = useProgressStore()

const gameState = ref( 'menu' ) // menu, playing, results
const currentQuestions = ref( [] )
const currentQuestionIndex = ref( 0 )
const score = ref( 0 )
const showFeedback = ref( false )
const selectedAnswer = ref( null )

const settings = reactive( {
  topics: ['math', 'alphabet'], // default
  count: 10
} )

const totalQuestions = computed( () => currentQuestions.value.length )
const currentQuestion = computed( () => currentQuestions.value[currentQuestionIndex.value] || {} )

const startQuiz = () => {
  const allQuestions = []

  // 1. Math Questions
  if ( settings.topics.includes( 'math' ) && contentStore.mathematics.length ) {
    contentStore.mathematics.forEach( m => {
      // Q1: Number -> Meaning
      allQuestions.push( {
        text: `What is the meaning of the number ${m.number}?`,
        correct: m.name,
        options: generateDistractors( m.name, contentStore.mathematics.map( x => x.name ) ),
        topicLabel: 'Supreme Mathematics',
        sourceId: `math_${m.number}`,
        type: 'meaning'
      } )
    } )
  }

  // 2. Alphabet Questions
  if ( settings.topics.includes( 'alphabet' ) && contentStore.alphabet.length ) {
    contentStore.alphabet.forEach( a => {
      allQuestions.push( {
        text: `What does the letter '${a.letter}' stand for?`,
        correct: a.name,
        options: generateDistractors( a.name, contentStore.alphabet.map( x => x.name ) ),
        topicLabel: 'Supreme Alphabet',
        sourceId: `alpha_${a.letter}`,
        type: 'meaning'
      } )
    } )
  }

  // 3. 12 Jewels Questions
  if ( settings.topics.includes( 'jewels' ) && contentStore.jewels.length ) {
    contentStore.jewels.forEach( j => {
      allQuestions.push( {
        text: `Which Jewel corresponds to: "${j.description?.substring( 0, 50 )}..."?`,
        correct: j.name,
        options: generateDistractors( j.name, contentStore.jewels.map( x => x.name ) ),
        topicLabel: '12 Jewels',
        sourceId: `jewel_${j.id}`,
        type: 'meaning'
      } )
    } )
  }

  // 4. Lessons Questions (limited to what we have)
  if ( settings.topics.includes( 'lessons' ) && contentStore.lessons.length ) {
    contentStore.lessons.forEach( l => {
      l.questions.forEach( ( q, idx ) => {
        // Truncate answers for multiple choice if too long
        const correctAnswer = q.answer.length > 50 ? q.answer.substring( 0, 50 ) + "..." : q.answer

        // Very hard to generate context-aware distractors for open-ended questions without AI.
        // We will try to pull random answers from OTHER questions in the same lesson as distractors.
        const otherAnswers = l.questions
          .filter( x => x.id !== q.id )
          .map( x => x.answer.length > 50 ? x.answer.substring( 0, 50 ) + "..." : x.answer )

        if ( otherAnswers.length >= 3 ) {
          allQuestions.push( {
            text: q.question,
            correct: correctAnswer,
            options: generateDistractors( correctAnswer, otherAnswers ),
            topicLabel: '120 Lessons',
            sourceId: `lesson_${l.id}_${idx}`,
            type: 'qa'
          } )
        }
      } )
    } )
  }


  // Shuffle and Slice
  const shuffled = allQuestions.sort( () => Math.random() - 0.5 )
  currentQuestions.value = shuffled.slice( 0, settings.count )

  if ( currentQuestions.value.length === 0 ) {
    alert( "No questions available for selected topics." )
    return
  }

  score.value = 0
  currentQuestionIndex.value = 0
  gameState.value = 'playing'
}

const generateDistractors = ( correct, pool ) => {
  const distractors = []
  while ( distractors.length < 3 ) {
    const rand = pool[Math.floor( Math.random() * pool.length )]
    if ( rand !== correct && !distractors.includes( rand ) ) {
      distractors.push( rand )
    }
  }
  return [...distractors, correct].sort( () => Math.random() - 0.5 )
}


const handleAnswer = ( option ) => {
  if ( showFeedback.value ) return

  selectedAnswer.value = option
  showFeedback.value = true

  if ( option === currentQuestion.value.correct ) {
    score.value++
  }

  setTimeout( () => {
    if ( currentQuestionIndex.value < totalQuestions.value - 1 ) {
      currentQuestionIndex.value++
      showFeedback.value = false
      selectedAnswer.value = null
    } else {
      finishQuiz()
    }
  }, 1500 )
}

const finishQuiz = async () => {
  gameState.value = 'results'
  // Save Result
  await progressStore.saveQuizResult( {
    score: score.value,
    totalQuestions: totalQuestions.value,
    topics: settings.topics,
    details: { /* could add breakdown here */ }
  } )
}

const getOptionClass = ( option ) => {
  if ( !showFeedback.value ) return 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 text-white'

  if ( option === currentQuestion.value.correct ) return 'bg-green-500/20 border-green-500 text-green-300'
  if ( option === selectedAnswer.value ) return 'bg-red-500/20 border-red-500 text-red-300'

  return 'bg-white/5 border-white/10 opacity-50 text-white'
}

onMounted( () => {
  contentStore.fetchAllContent()
} )
</script>
