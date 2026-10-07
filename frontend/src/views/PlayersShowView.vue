<script setup lang="ts">
import type { PlayerInterface } from '@/interfaces/PlayerInterface.js';
import { PlayerService } from '@/services/PlayerService.js';
import { formatUsd } from '@/utils/currencyFormatter.js';
import { formatShortDate } from '@/utils/dateFormatter.js';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

// --- State ---
const route = useRoute();
const player = ref<PlayerInterface | null>(null);

// --- Computed ---
const initials = computed(() =>
  (player.value?.name ?? '')
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
);

// --- Lifecycle ---
onMounted(async () => {
  const playerId = Number(route.params.id);
  player.value = await PlayerService.getPlayerById(playerId);
});
</script>

<template>
  <section v-if="player">
    <div class="mx-auto max-w-4xl space-y-8">
      <div class="rounded-lg border border-white/10 bg-neutral-900 p-8 shadow">
        <div class="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div
            class="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-3xl font-bold text-neutral-950"
          >
            {{ initials }}
          </div>
          <div>
            <p class="text-sm font-semibold uppercase text-cyan-300">Player</p>
            <h1 class="mt-1 text-3xl font-bold text-white">{{ player.name }}</h1>
            <p class="mt-1 text-gray-400">{{ player.nickname }}</p>
            <p class="mt-4 text-sm text-gray-400">
              {{ player.name }} competes as a {{ player.role }} representing {{ player.country }}.
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="rounded-lg border border-white/10 bg-neutral-900 p-6 text-center shadow">
          <p class="text-4xl font-bold text-cyan-400">{{ player.wins }}</p>
          <p class="mt-1 text-xs uppercase tracking-wide text-gray-500">Wins</p>
        </div>
        <div class="rounded-lg border border-white/10 bg-neutral-900 p-6 text-center shadow">
          <p class="text-4xl font-bold text-cyan-400">{{ formatUsd(player.earnings) }}</p>
          <p class="mt-1 text-xs uppercase tracking-wide text-gray-500">Earnings</p>
        </div>
      </div>

      <div class="rounded-lg border border-white/10 bg-neutral-900 p-6 shadow">
        <h2 class="mb-4 text-lg font-semibold text-white">Player information</h2>
        <div class="divide-y divide-white/10">
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Name</span>
            <span class="font-medium text-white">{{ player.name }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Nickname</span>
            <span class="font-medium text-white">{{ player.nickname }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Role</span>
            <span class="font-medium text-white">{{ player.role }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Country</span>
            <span class="font-medium text-white">{{ player.country }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Wins</span>
            <span class="font-medium text-white">{{ player.wins }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Earnings</span>
            <span class="font-medium text-white">{{ formatUsd(player.earnings) }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Created</span>
            <span class="font-medium text-white">{{ formatShortDate(player.createdAt) }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Updated</span>
            <span class="font-medium text-white">{{ formatShortDate(player.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
