<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <section>
    <div
      class="relative overflow-hidden rounded-lg border border-white/10 bg-neutral-900 px-8 py-16 shadow sm:px-12 sm:py-20"
    >
      <div
        class="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
      ></div>
      <div class="relative max-w-2xl">
        <p class="text-sm font-semibold uppercase text-cyan-300">Command center</p>
        <h1 class="mt-1 text-4xl font-bold text-white sm:text-5xl">
          Build and manage your esports roster
        </h1>
        <p class="mt-6 text-lg text-gray-400">
          Track players, roles, wins, and earnings in one dashboard built for competitive teams.
        </p>
        <RouterLink
          to="/players"
          class="mt-8 inline-flex items-center gap-2 rounded bg-cyan-400 px-6 py-3 font-semibold text-neutral-950 transition-colors hover:bg-cyan-300"
        >
          View roster
        </RouterLink>
      </div>
    </div>
  </section>
</template>
