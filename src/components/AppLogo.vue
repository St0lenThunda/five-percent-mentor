<template>
  <img
    src="/images/logo.jpg"
    alt="Five Percenter Logo"
    :class="customClass"
    class="object-contain"
  />
</template>

<script setup>
defineProps( {
  customClass: {
    type: String,
    default: ''
  }
} )
</script>

<style scoped>
/* Ensure gradient colors match theme if not overridden */
</style>
