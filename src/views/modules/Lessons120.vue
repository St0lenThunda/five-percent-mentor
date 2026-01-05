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
              v-for=" lesson in contentStore.lessons "
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
                    <p class="text-purple-200">{{ activeLesson.description }}</p>
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
import { ref, onMounted, watch } from 'vue'
import { useContentStore } from '../../stores/content'

const contentStore = useContentStore()
const activeLesson = ref( null )

onMounted( async () => {
  await contentStore.fetchAllContent()
  // Auto-select first lesson if available
  if ( contentStore.lessons.length > 0 ) {
    activeLesson.value = contentStore.lessons[0]
  }
} )
</script>
