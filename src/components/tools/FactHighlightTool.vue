<template>
  <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
    <div class="flex justify-between items-start mb-6">
      <div>
        <p class="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Knowledge Drop</p>
        <h3 class="text-xl font-black text-white uppercase tracking-tight">Did You Know?</h3>
      </div>
      <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
        🌍
      </div>
    </div>

    <div v-if="currentFact" class="space-y-4">
      <div class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-300 leading-tight">
        {{ currentFact.answer.includes('miles') ? currentFact.answer.split(' ')[0] : 'Knowledge' }}
      </div>
      <p class="text-sm text-purple-100 leading-relaxed font-serif">
        {{ currentFact.question }}
      </p>
      <div class="pt-2 flex items-center gap-2">
        <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest">{{ currentFact.topic === 'actual' ? 'Actual Fact' : 'Solar Fact' }}</span>
        <span class="w-1 h-1 rounded-full bg-white/20"></span>
        <span class="text-[10px] font-bold text-white/40 uppercase tracking-widest">#{{ currentFact.number }}</span>
      </div>
    </div>

    <button 
      @click="rotateFact"
      class="absolute bottom-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all active:scale-90"
      title="Rotate Fact"
    >
      <span class="block hover:rotate-180 transition-transform duration-500">🔄</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useContentStore } from '../../stores/content'

const contentStore = useContentStore()
const currentFact = ref(null)

const rotateFact = () => {
  const allFacts = [
    ...(contentStore.actualFacts || []).map(f => ({ ...f, topic: 'actual' })),
    ...(contentStore.solarFacts || []).map(f => ({ ...f, topic: 'solar' }))
  ]
  
  if (allFacts.length === 0) return
  
  let newFact
  do {
    newFact = allFacts[Math.floor(Math.random() * allFacts.length)]
  } while (currentFact.value && newFact.id === currentFact.value.id && allFacts.length > 1)
  
  currentFact.value = newFact
}

onMounted(async () => {
  await contentStore.fetchAllContent()
  rotateFact()
})
</script>
