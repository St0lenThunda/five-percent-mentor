<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from './stores/user'
import { RouterView } from 'vue-router'

const userStore = useUserStore()

onMounted(() => {
  userStore.init()
})
</script>
