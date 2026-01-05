<template>
  <div class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-white/10">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">{{ icon }}</span>
          <h2 class="text-2xl font-bold text-white">{{ title }}</h2>
          <span class="text-sm text-purple-400">({{ items.length }})</span>
        </div>
        <slot name="header-actions"></slot>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="p-12 text-center">
      <div class="animate-spin text-4xl">🌀</div>
    </div>

    <!-- Table -->
    <table v-else-if="items.length > 0" class="w-full">
      <thead class="bg-white/5">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-3 text-xs font-semibold text-purple-300 uppercase tracking-wider"
            :class="col.align === 'right' ? 'text-right' : 'text-left'"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        <tr
          v-for="(item, index) in items"
          :key="item.id || index"
          class="hover:bg-white/5 cursor-pointer transition-colors"
          @click="$emit('row-click', item)"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-4"
            :class="col.align === 'right' ? 'text-right' : 'text-left'"
          >
            <slot :name="`cell-${col.key}`" :item="item" :value="item[col.key]">
              <span class="text-sm text-purple-200">{{ item[col.key] }}</span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty State -->
    <div v-else class="p-12 text-center text-purple-400">
      <div class="text-4xl mb-4">{{ emptyIcon }}</div>
      <p>{{ emptyText }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: '📝' },
  items: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  emptyIcon: { type: String, default: '📭' },
  emptyText: { type: String, default: 'No items found.' }
})

defineEmits(['row-click'])
</script>
