<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

const route = useRoute()

const showHeader = computed(() => {
  return !['CountBookAPI', 'GetAllBookAPI'].includes(route.name)
})
</script>

<template>
  <BHeader v-if="showHeader" />

  <main>
    <router-view />
  </main>
</template>
