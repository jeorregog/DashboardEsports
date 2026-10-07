<script setup lang="ts">
import AppNavbar from '@/components/common/AppNavbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-white">
    <AppNavbar />
    <main class="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>
