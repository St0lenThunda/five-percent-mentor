<template>
  <router-link
    :to="route"
    class="group block relative perspective-1000"
  >
    <div
      class="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-6 transition-all duration-700 transform-style-3d group-hover:rotate-y-12 group-hover:bg-primary-500/10 group-hover:border-primary-500/30 overflow-hidden"
    >
      <!-- Background Glow -->
      <div 
        class="absolute -inset-24 bg-primary-500/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"
      ></div>

      <div class="flex justify-between items-start mb-6">
        <div class="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-primary-500/50 transition-colors">
          <span class="text-3xl drop-shadow-lg">{{ icon }}</span>
        </div>
        
        <!-- Mastery Ring -->
        <div class="relative w-12 h-12 flex items-center justify-center">
          <svg class="w-full h-full -rotate-90">
            <circle
              cx="24" cy="24" r="20"
              fill="transparent"
              stroke="currentColor"
              stroke-width="3"
              class="text-white/5"
            />
            <circle
              cx="24" cy="24" r="20"
              fill="transparent"
              stroke="currentColor"
              stroke-width="3"
              :stroke-dasharray="125.66"
              :stroke-dashoffset="125.66 * (1 - progress / 100)"
              class="text-primary-500 transition-all duration-1000"
            />
          </svg>
          <span class="absolute text-[10px] font-black text-primary-400">{{ Math.round(progress) }}%</span>
        </div>
      </div>

      <h3 class="text-xl font-black text-white mb-2 tracking-tight group-hover:text-primary-400 transition-colors uppercase">
        {{ title }}
      </h3>
      <p class="text-xs text-purple-200/60 leading-relaxed line-clamp-2">
        {{ subtitle }}
      </p>

      <!-- Progress Bar (Mini) -->
      <div class="mt-6 space-y-2">
        <div class="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-purple-400">
          <span>Mastery Status</span>
          <span :class="progress === 100 ? 'text-primary-400' : 'text-purple-300'">
            {{ progress === 100 ? 'Born' : 'Building' }}
          </span>
        </div>
        <div class="h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-1000"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  icon: String,
  route: String,
  progress: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.transform-style-3d {
  transform-style: preserve-3d;
}
</style>
