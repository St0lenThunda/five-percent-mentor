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
            <span class="text-3xl">✍️</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                Self Assessment
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
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-4">Knowledge of Self</h2>
          <p class="text-xl text-purple-200">
            Test your knowledge with quizzes and reflections. Measure your growth and identify areas for deepening.
          </p>
        </div>

        <!-- Assessment Tools Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Flashcards -->
          <router-link
            to="/flashcards"
            class="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-primary-500 hover:scale-[1.02] transition-all"
          >
            <span class="text-5xl mb-6 block group-hover:scale-110 transition-transform w-fit">🎴</span>
            <h3 class="text-2xl font-bold text-white mb-3">Flashcards</h3>
            <p class="text-purple-200 mb-4">Master degrees with active recall. Study Supreme Mathematics, Supreme Alphabet, 12 Jewels, and the 120 Lessons.</p>
            <span class="text-primary-400 font-semibold">Begin Study →</span>
          </router-link>

          <!-- Quizzes -->
          <router-link
            to="/quizzes"
            class="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-gold-500 hover:scale-[1.02] transition-all"
          >
            <span class="text-5xl mb-6 block group-hover:scale-110 transition-transform w-fit">🎯</span>
            <h3 class="text-2xl font-bold text-white mb-3">Quizzes</h3>
            <p class="text-purple-200 mb-4">Test your understanding with interactive quizzes. Track your progress and identify areas to strengthen.</p>
            <span class="text-gold-400 font-semibold">Take Quiz →</span>
          </router-link>
        </div>

        <!-- Progress Section -->
        <div class="mt-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h3 class="text-2xl font-bold text-white mb-6">Your Progress</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-400 mb-2">{{ progressStore.flashcardCount }}</div>
              <div class="text-sm text-purple-200">Cards Reviewed</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-gold-400 mb-2">{{ progressStore.quizCount }}</div>
              <div class="text-sm text-purple-200">Quizzes Completed</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-accent-400 mb-2">{{ progressStore.masteredCount }}</div>
              <div class="text-sm text-purple-200">Cards Mastered</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-emerald-400 mb-2">{{ progressStore.streakDays }}</div>
              <div class="text-sm text-purple-200">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useProgressStore } from '../../stores/progress'

const progressStore = useProgressStore()
</script>
