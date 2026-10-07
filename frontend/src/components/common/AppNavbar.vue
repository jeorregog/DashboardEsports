<script setup lang="ts">
import { Gamepad2, Home, Info, Users } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

// AppNavbar: pure presentation component for top navigation.
const navLinkClass =
  'inline-flex h-9 shrink-0 items-center gap-2 rounded px-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/10 hover:text-white'
const activeNavLinkClass =
  '!bg-cyan-400 !text-neutral-950 shadow shadow-cyan-500/20 hover:!bg-cyan-300 hover:!text-neutral-950'
</script>

<template>
  <nav class="border-b border-white/10 bg-neutral-950 text-white">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8"
    >
      <RouterLink to="/" class="inline-flex items-center gap-2 text-lg font-bold text-white">
        <Gamepad2 class="h-5 w-5 text-cyan-300" />
        E-Sports Dashboard
      </RouterLink>

      <div class="flex flex-wrap items-center gap-2">
        <RouterLink to="/" :class="navLinkClass" :exact-active-class="activeNavLinkClass">
          <Home class="h-4 w-4" />
          Home
        </RouterLink>
        <RouterLink to="/players" :class="navLinkClass" :exact-active-class="activeNavLinkClass">
          <Users class="h-4 w-4" />
          Players
        </RouterLink>
        <RouterLink to="/about" :class="navLinkClass" :exact-active-class="activeNavLinkClass">
          <Info class="h-4 w-4" />
          About
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
