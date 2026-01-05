<template>
  <transition name="born-popup">
    <div
      v-if=" visible "
      class="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm"
    >
      <div class="relative group">
        <!-- Glow Aura -->
        <div
          class="absolute -inset-4 bg-gradient-to-r from-gold-500/50 to-primary-500/50 blur-2xl animate-pulse opacity-70"
        ></div>

        <div
          class="relative backdrop-blur-2xl bg-black/80 border border-gold-500/50 rounded-2xl p-6 shadow-2xl flex items-center gap-6 overflow-hidden"
        >
          <!-- Particles Decoration -->
          <div class="absolute inset-0 pointer-events-none">
            <div class="absolute w-1 h-1 bg-white rounded-full animate-ping top-4 left-1/4"></div>
            <div class="absolute w-1 h-1 bg-gold-400 rounded-full animate-ping bottom-4 right-1/4"></div>
          </div>

          <div
            class="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-primary-600 flex items-center justify-center text-3xl shadow-lg shadow-gold-500/30 shrink-0"
          >
            {{ notificationData?.icon }}
          </div>

          <div class="flex-1">
            <h4 class="text-xs font-black text-gold-400 uppercase tracking-[0.3em] mb-1">
              {{ notificationData?.type }}
            </h4>
            <div class="text-xl font-black text-white leading-none mb-1">
              {{ notificationData?.name }}
            </div>
            <p class="text-[10px] text-purple-200 uppercase tracking-widest font-bold">
              {{ notificationData?.subText }}
            </p>
          </div>

          <!-- Level Progress Small -->
          <div class="flex flex-col items-center gap-1">
            <div class="text-lg font-black text-gold-500">
              {{ notificationData?.level || 'Born' }}
            </div>
            <div class="w-1 h-8 bg-white/10 rounded-full relative">
              <div
                class="absolute bottom-0 left-0 w-full bg-gold-500 transition-all duration-1000"
                :style="{ height: `${notificationData?.progress || 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAttributesStore } from '../stores/attributes'
import { useProgressStore } from '../stores/progress'

const attributesStore = useAttributesStore()
const progressStore = useProgressStore()
const visible = ref( false )
const notificationData = ref( null )

const showNotification = ( data ) => {
  notificationData.value = data
  visible.value = true

  // Auto hide
  setTimeout( () => {
    visible.value = false
  }, 5000 )
}

watch( () => attributesStore.lastGrowth, ( newVal ) => {
  if ( newVal ) {
    showNotification( {
      ...newVal,
      type: 'Attribute Elevation',
      icon: '☀️',
      subText: `Manifested to Level ${newVal.level} / 10`,
      progress: newVal.level * 10
    } )
    setTimeout( () => { attributesStore.lastGrowth = null }, 500 )
  }
} )

watch( () => progressStore.lastMastery, ( newVal ) => {
  if ( newVal ) {
    showNotification( {
      ...newVal,
      type: newVal.message || 'Knowledge Mastered',
      icon: newVal.type === 'mathematics' ? '🔢' : '🅰️',
      subText: 'Added to your Mastered Badge collection',
      progress: 100
    } )
    setTimeout( () => { progressStore.lastMastery = null }, 500 )
  }
} )
</script>

<style scoped>
.born-popup-enter-active,
.born-popup-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.born-popup-enter-from {
  opacity: 0;
  transform: translate(-50%, 50px) scale(0.9);
}

.born-popup-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.95);
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
