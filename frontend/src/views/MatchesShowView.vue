<script setup lang="ts">
// external imports
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

// internal imports
import ApiErrorParser from '@/utils/ApiErrorParser.js';
import DateFormatter from '@/utils/DateFormatter.js';
import type { MatchInterface } from '@/interfaces/MatchInterface.js';
import { MatchService } from '@/services/MatchService.js';

// --- State ---
const route = useRoute();
const match = ref<MatchInterface | null>(null);
const pageError = ref('');

// --- Computed ---
const formattedDate = computed(() =>
  match.value ? DateFormatter.formatShortDate(match.value.date) : '',
);

// --- Lifecycle ---
onMounted(async () => {
  try {
    match.value = await MatchService.getById(Number(route.params.id));
  } catch (error: unknown) {
    pageError.value = ApiErrorParser.getMessage(error, 'Unable to load the match.');
  }
});
</script>

<template>
  <section>
    <p
      v-if="pageError"
      class="mb-4 rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
    >
      {{ pageError }}
    </p>

    <div v-if="match" class="mx-auto max-w-4xl space-y-8">
      <div class="rounded-lg border border-white/10 bg-neutral-900 p-8 shadow">
        <p class="text-sm font-semibold uppercase text-cyan-300">{{ match.game }}</p>
        <h1 class="mt-1 text-3xl font-bold text-white">
          {{ match.team1.name }} vs {{ match.team2.name }}
        </h1>
        <p class="mt-2 text-gray-400">{{ formattedDate }}</p>
      </div>

      <div class="rounded-lg border border-white/10 bg-neutral-900 p-6 text-center shadow">
        <p class="text-4xl font-bold text-cyan-400">{{ match.winner.name }}</p>
        <p class="mt-1 text-xs uppercase tracking-wide text-gray-500">Winner</p>
      </div>

      <div class="rounded-lg border border-white/10 bg-neutral-900 p-6 shadow">
        <h2 class="mb-4 text-lg font-semibold text-white">Match information</h2>
        <div class="divide-y divide-white/10">
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Game</span>
            <span class="font-medium text-white">{{ match.game }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Date</span>
            <span class="font-medium text-white">{{ formattedDate }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Team 1</span>
            <RouterLink
              :to="{ name: 'team', params: { id: match.team1.id } }"
              class="font-medium text-cyan-300 hover:text-cyan-200"
            >
              {{ match.team1.name }}
            </RouterLink>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Team 2</span>
            <RouterLink
              :to="{ name: 'team', params: { id: match.team2.id } }"
              class="font-medium text-cyan-300 hover:text-cyan-200"
            >
              {{ match.team2.name }}
            </RouterLink>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Winner</span>
            <span class="font-medium text-white">{{ match.winner.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
