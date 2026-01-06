<template>
  <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
    <div class="flex justify-between items-start mb-4">
      <div>
        <p class="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mb-1">Daily Jewel</p>
        <h3 class="text-xl font-black text-white uppercase tracking-tight">{{ currentJewel?.name }}</h3>
      </div>
      <div class="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-xl">
        💎
      </div>
    </div>

    <div v-if="!isSecured" class="space-y-4">
      <p class="text-sm text-purple-200/70 leading-relaxed italic">
        "{{ currentJewel?.description }}"
      </p>
      <button
        @click="secureJewel"
        class="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95"
      >
        Secure This Jewel
      </button>
    </div>

    <div v-else class="py-4 text-center animate-bounce-in">
      <div class="text-4xl mb-2">✨</div>
      <p class="text-primary-400 font-black uppercase tracking-widest text-sm">Jewel Secured</p>
      <p class="text-[10px] text-purple-300 mt-1">Consistency Manifested ✊🏿</p>
    </div>

    <!-- Decorative inner glow -->
    <div class="absolute -bottom-12 -right-12 w-24 h-24 bg-primary-500/10 blur-2xl rounded-full group-hover:bg-primary-500/20 transition-colors"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContentStore } from '../../stores/content'
import { useAttributesStore } from '../../stores/attributes'

const contentStore = useContentStore()
const attributesStore = useAttributesStore()
const isSecured = ref(false)

const currentJewel = computed(() => {
  if (!contentStore.jewels || contentStore.jewels.length === 0) return null
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  return contentStore.jewels[dayOfYear % contentStore.jewels.length]
})

const secureJewel = async () => {
  isSecured.value = true
  // Impact attributes (Culture/Refinement/Power)
  await attributesStore.processTopicImpact(['jewels'])
}

onMounted(async () => {
  await contentStore.fetchAllContent()
})
</script>

<style scoped>
.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
