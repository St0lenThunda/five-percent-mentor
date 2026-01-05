<template>
  <div class="min-h-screen">
    <RouterView />
    <BornNotification />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from './stores/user'
import { RouterView } from 'vue-router'
import BornNotification from './components/BornNotification.vue'

const userStore = useUserStore()

// Initial session check is now handled in main.js
</script>
