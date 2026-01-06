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
            <span class="text-3xl">📜</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                120 Lessons
              </h1>
              <p class="text-xs text-purple-200">The Book of Life</p>
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

      <!-- Content -->
      <div
        v-else
        class="max-w-5xl mx-auto"
      >
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <!-- Lesson Sidebar -->
          <div class="lg:col-span-1 space-y-4">
            <div
              v-for=" lesson in allLessons "
              :key="lesson.id"
              @click="activeLesson = lesson"
              class="cursor-pointer p-4 rounded-xl border border-white/10 transition-all duration-300 hover:scale-105"
              :class="activeLesson?.id === lesson.id ? 'bg-primary-500/20 border-primary-500 text-white' : 'bg-white/5 text-purple-200 hover:bg-white/10'"
            >
              <h3 class="font-bold">{{ lesson.title }}</h3>
              <p class="text-xs mt-1 opacity-70">{{ lesson.questions.length }} Questions</p>
            </div>
          </div>

          <!-- Active Lesson View -->
          <div class="lg:col-span-3">
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              link-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-4"
              mode="out-in"
            >
              <div
                v-if=" activeLesson "
                :key="activeLesson.id"
                class="backdrop-blur-lg bg-black/20 rounded-3xl p-8 border border-white/10"
              >
                <div class="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                  <div>
                    <h2 class="text-3xl font-bold text-white mb-2">{{ activeLesson.title }}</h2>
                    <p class="text-purple-200 mb-4">{{ activeLesson.description }}</p>

                    <!-- Tags and Links -->
                    <div class="flex flex-wrap gap-2 mb-2">
                      <span
                        v-for=" tag in activeLesson.tags "
                        :key="tag"
                        class="px-2 py-0.5 rounded bg-primary-500/10 border border-primary-500/20 text-[10px] text-primary-400 font-bold uppercase tracking-widest"
                      >
                        #{{ tag }}
                      </span>
                    </div>

                    <div
                      v-if=" activeLesson.relatedTo && activeLesson.relatedTo.length > 0 "
                      class="flex flex-wrap gap-4 items-center"
                    >
                      <span class="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Related:</span>
                      <button
                        v-for=" relId in activeLesson.relatedTo "
                        :key="relId"
                        @click="activeLesson = allLessons.find( l => l.id === relId ) || activeLesson"
                        class="text-xs text-primary-400 hover:text-primary-300 underline transition-colors"
                      >
                        {{allLessons.find( l => l.id === relId )?.title || relId}}
                      </button>
                    </div>
                  </div>
                  <!-- Master Lesson Button (Optional future feature for whole lesson) -->
                </div>

                <div class="space-y-6">
                  <div
                    v-for=" ( qa, index ) in activeLesson.questions "
                    :key="qa.id"
                    class="group relative pl-6 border-l-2 border-white/10 hover:border-primary-500 transition-colors"
                  >
                    <div
                      class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-900 border-2 border-white/20 group-hover:border-primary-500 transition-colors"
                    ></div>

                    <div class="mb-2">
                      <span class="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1 block">
                        Question {{ index + 1 }}
                      </span>
                      <h4 class="text-lg font-semibold text-white">{{ qa.question }}</h4>
                    </div>

                    <div class="bg-white/5 rounded-xl p-4 mt-3">
                      <p class="text-purple-100 leading-relaxed font-serif text-lg">
                        {{ qa.answer }}
                      </p>
                    </div>

                    <!-- Individual Q mastery check could go here -->
                  </div>

                  <div
                    v-if=" activeLesson.questions.length === 0 "
                    class="text-center py-12 text-purple-300 italic"
                  >
                    Content for this lesson is being transcribed...
                  </div>
                </div>
              </div>

              <div
                v-else
                class="flex flex-col items-center justify-center h-64 text-center text-purple-300"
              >
                <span class="text-6xl mb-4 opacity-50">📜</span>
                <p class="text-xl">Select a lesson from the sidebar to begin study.</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useContentStore } from '../../stores/content'

const route = useRoute()
const contentStore = useContentStore()
const activeLesson = ref( null )

const allLessons = computed( () => {
  const baseLessons = ( contentStore.lessons || [] ).map( l => ( {
    ...l,
    tags: l.tags || [],
    relatedTo: l.relatedTo || []
  } ) )

  const additional = []

  if ( contentStore.actualFacts && contentStore.actualFacts.length > 0 ) {
    additional.push( {
      id: 'actual_facts',
      title: 'Actual Facts',
      description: '13 essential facts about the Planet Earth, its geography, and its mechanics.',
      tags: ['earth', 'science', 'geography'],
      relatedTo: ['solar_facts'],
      questions: contentStore.actualFacts.map( f => ( {
        id: f.id,
        question: f.question,
        answer: f.answer
      } ) )
    } )
  }

  if ( contentStore.solarFacts && contentStore.solarFacts.length > 0 ) {
    additional.push( {
      id: 'solar_facts',
      title: 'Solar Facts',
      description: 'The 9 planetary distances from the Sun, representing the breadth of our solar system.',
      tags: ['solar', 'planets', 'distance'],
      relatedTo: ['actual_facts'],
      questions: contentStore.solarFacts.map( f => ( {
        id: f.id,
        question: `What is the distance of ${f.planet} from the Sun?`,
        answer: f.fact
      } ) )
    } )
  }

  return [...baseLessons, ...additional]
} )

onMounted( async () => {
  await contentStore.fetchAllContent()
} )

watch( [allLessons, () => route.query.lesson], ( [newLessons, lessonId] ) => {
  if ( newLessons.length > 0 ) {
    if ( lessonId ) {
      const found = newLessons.find( l => l.id === lessonId )
      if ( found ) {
        activeLesson.value = found
        return
      }
    }

    if ( !activeLesson.value ) {
      activeLesson.value = newLessons[0]
    }
  }
}, { immediate: true } )
</script>
