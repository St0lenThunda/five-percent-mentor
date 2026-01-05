<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Ambient Backdrop Effects -->
    <div class="fixed inset-0 pointer-events-none opacity-20">
      <div
        class="absolute w-[800px] h-[800px] -top-1/4 -right-1/4 bg-primary-900/40 rounded-full blur-[120px] animate-pulse"
      ></div>
      <div
        class="absolute w-[600px] h-[600px] -bottom-1/4 -left-1/4 bg-purple-900/30 rounded-full blur-[100px] animate-pulse-slow"
      ></div>
    </div>

    <!-- Immersive Header -->
    <header class="backdrop-blur-xl bg-black/40 border-b border-white/5 sticky top-0 z-50">
      <div class="container mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <router-link
            to="/"
            class="flex items-center gap-4 group"
          >
            <div
              class="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:border-primary-500/50 transition-all"
            >
              <span class="text-3xl drop-shadow-lg">{{ icon }}</span>
            </div>
            <div>
              <h1
                class="text-2xl font-black text-white tracking-tight group-hover:text-primary-400 transition-colors uppercase"
              >
                {{ title }}
              </h1>
              <p class="text-[10px] text-primary-400 font-mono tracking-[0.2em] uppercase">{{ subtitle }}</p>
            </div>
          </router-link>
          <router-link
            to="/"
            class="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm font-bold text-purple-200 hover:text-white flex items-center gap-2"
          >
            <span>←</span> Dashboard
          </router-link>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-6 py-12 relative z-10">
      <slot>
        <div class="max-w-4xl mx-auto text-center">
          <div
            class="backdrop-blur-2xl bg-white/5 rounded-[3rem] p-16 border border-white/10 shadow-2xl relative overflow-hidden group"
          >
            <!-- Decorative inner glow -->
            <div
              class="absolute -inset-24 bg-primary-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>

            <div class="text-9xl mb-8 relative drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-float">{{ icon }}
            </div>
            <h2 class="text-5xl font-black mb-6 text-white tracking-tighter">{{ title }}</h2>
            <p class="text-xl text-purple-200/60 mb-12 max-w-2xl mx-auto leading-relaxed">{{ description }}</p>

            <div
              class="inline-flex items-center gap-3 px-8 py-4 bg-primary-500/10 rounded-2xl border border-primary-500/20 backdrop-blur-md"
            >
              <div class="w-2 h-2 rounded-full bg-primary-500 animate-ping"></div>
              <p class="text-sm font-black text-primary-400 tracking-widest uppercase">Building the Knowledge Foundation
              </p>
            </div>
          </div>
        </div>
      </slot>
    </main>
  </div>
</template>

<script>
export default {
  name: 'ModuleTemplate',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: 'Knowledge → Wisdom → Understanding'
    },
    description: {
      type: String,
      required: true
    }
  }
}
</script>
