<template>
  <div
    class="relative group cursor-pointer perspective-1000"
    @click="$emit( 'select', attribute )"
  >
    <div
      class="card-inner relative h-64 transition-all duration-[800ms] transform-style-3d group-hover:shadow-primary-500/20"
      :class="{ 'ring-2 ring-gold-500/50 shadow-[0_0_20px_rgba(234,179,8,0.3)] shadow-xl': isBuilding }"
    >
      <!-- Front -->
      <div
        class="absolute inset-0 backface-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center group-hover:bg-primary-500/10 group-hover:border-primary-500/50 transition-all shadow-2xl"
      >
        <!-- Manifested Badge -->
        <div
          v-if=" buildLevel > 0 "
          class="absolute top-4 left-4 px-2 py-0.5 bg-primary-500 rounded-md text-[8px] font-black text-white tracking-widest uppercase shadow-[0_0_10px_rgba(168,85,247,0.5)] z-20"
        >
          {{ buildLevel * 10 }}% Built
        </div>

        <div class="absolute top-4 right-4 text-[10px] font-mono text-primary-400 opacity-50">
          #{{ index + 1 }}
        </div>

        <div class="text-4xl mb-4 font-black bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
          {{ attribute.name }}
        </div>

        <div class="text-xs uppercase tracking-[0.2em] text-purple-400 font-bold mb-4">
          {{ attribute.meaning }}
        </div>

        <!-- Consistency Progress Indicator -->
        <div class="w-full max-w-[120px] h-1 bg-white/5 rounded-full overflow-hidden mb-4 relative">
          <div
            class="absolute inset-0 bg-primary-500 transition-all duration-1000"
            :style="{ width: `${Math.min( buildLevel * 10, 100 )}%` }"
          ></div>
          <div
            v-if=" buildLevel > 0 "
            class="absolute inset-0 bg-white/20 animate-pulse"
            :style="{ width: `${Math.min( buildLevel * 10, 100 )}%` }"
          ></div>
        </div>

        <div class="text-[9px] font-black text-primary-400/50 tracking-widest uppercase">
          Consistency: {{ buildLevel }} / 10
        </div>

        <div class="mt-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="w-1 h-1 rounded-full bg-primary-500"></div>
          <div class="w-1 h-1 rounded-full bg-primary-400"></div>
          <div class="w-1 h-1 rounded-full bg-primary-300"></div>
        </div>
      </div>
    </div>

    <!-- Aura Decoration -->
    <div
      class="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity -z-10 rounded-full"
    ></div>
  </div>
</template>

<script setup>
defineProps( {
  attribute: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  buildLevel: {
    type: Number,
    default: 0
  },
  isBuilding: {
    type: Boolean,
    default: false
  }
} )

defineEmits( ['select'] )
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.group:hover .card-inner {
  transform: rotateY(15deg) rotateX(8deg);
}
</style>
