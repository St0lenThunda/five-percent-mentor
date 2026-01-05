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
            <span class="text-3xl">📚</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                Knowledge Library
              </h1>
              <p class="text-xs text-purple-200">Curated Readings</p>
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
        class="flex justify-center py-20"
      >
        <div class="animate-spin text-4xl">🌀</div>
      </div>

      <div
        v-else
        class="max-w-6xl mx-auto"
      >
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-4">Required Reading</h2>
          <p class="text-xl text-purple-200 max-w-2xl mx-auto">
            Expand your cipher with these foundational texts.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for=" book in contentStore.library "
            :key="book.id"
            class="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300 group"
          >
            <div
              class="h-48 bg-black/40 rounded-xl mb-6 flex items-center justify-center border border-white/5 group-hover:bg-black/60"
            >
              <span class="text-6xl opacity-50">📖</span>
            </div>

            <div class="mb-4">
              <span class="text-xs font-bold text-primary-400 uppercase tracking-widest">{{ book.category }}</span>
            </div>

            <h3 class="text-xl font-bold text-white mb-2">{{ book.title }}</h3>
            <p class="text-sm text-purple-300 mb-4">by {{ book.author }}</p>

            <p class="text-purple-200 text-sm leading-relaxed mb-6">
              {{ book.description }}
            </p>

            <button
              class="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-purple-200 transition-colors flex items-center justify-center gap-2"
            >
              <span>View Details</span> <!-- Future: Link to purchase/read -->
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useContentStore } from '../../stores/content'

const contentStore = useContentStore()

onMounted( () => {
  contentStore.fetchAllContent()
} )
</script>
