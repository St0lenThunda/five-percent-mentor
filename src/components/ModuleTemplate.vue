<template>
  <div class="min-h-screen">
    <header class="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0 z-50">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center gap-3 group">
            <span class="text-3xl">{{ icon }}</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                {{ title }}
              </h1>
              <p class="text-xs text-purple-200">{{ subtitle }}</p>
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
      <div class="max-w-4xl mx-auto text-center">
        <div class="backdrop-blur-lg bg-white/5  rounded-3xl p-12 border border-white/10">
          <div class="text-8xl mb-6">{{ icon }}</div>
          <h2 class="text-4xl font-bold mb-4 text-white">{{ title }}</h2>
          <p class="text-xl text-purple-200 mb-8">{{ description }}</p>
          <div class="inline-block px-6 py-3 bg-primary-500/20 rounded-lg border border-primary-500/30">
            <p class="text-sm text-primary-200">🚧 Module in development 🚧</p>
          </div>
        </div>
      </div>
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
