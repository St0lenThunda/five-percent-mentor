<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
    >
      <div class="text-3xl font-bold" :class="stat.color || 'text-primary-400'">{{ stat.value }}</div>
      <div class="text-xs text-purple-300">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Array,
    required: true
    // Each stat: { value: string|number, label: string, color?: string }
  }
})
</script>
