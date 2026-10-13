<script setup lang="ts">
// external imports
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

// internal imports
import ApiErrorParser from '@/utils/ApiErrorParser.js';
import DateFormatter from '@/utils/DateFormatter.js';
import type { TeamInterface } from '@/interfaces/TeamInterface.js';
import { TeamService } from '@/services/TeamService.js';

// --- State ---
const route = useRoute();
const team = ref<TeamInterface | null>(null);
const pageError = ref('');

// --- Computed ---
const initials = computed(() =>
  (team.value?.name ?? '')
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
);

const formattedFollowers = computed(() => team.value?.followers.toLocaleString('en-US') ?? '');

const formattedCreatedAt = computed(() =>
  team.value ? DateFormatter.formatShortDate(team.value.createdAt) : '',
);

const formattedUpdatedAt = computed(() =>
  team.value ? DateFormatter.formatShortDate(team.value.updatedAt) : '',
);

// --- Lifecycle ---
onMounted(async () => {
  try {
    team.value = await TeamService.getById(Number(route.params.id));
  } catch (error: unknown) {
    pageError.value = ApiErrorParser.getMessage(error, 'Unable to load the team.');
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

    <div v-if="team" class="mx-auto max-w-4xl space-y-8">
      <div class="rounded-lg border border-white/10 bg-neutral-900 p-8 shadow">
        <div class="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div
            class="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-3xl font-bold text-neutral-950"
          >
            {{ initials }}
          </div>
          <div>
            <p class="text-sm font-semibold uppercase text-cyan-300">Team</p>
            <h1 class="mt-1 text-3xl font-bold text-white">{{ team.name }}</h1>
            <p class="mt-1 text-gray-400">{{ team.country }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="rounded-lg border border-white/10 bg-neutral-900 p-6 text-center shadow">
          <p class="text-4xl font-bold text-cyan-400">{{ formattedFollowers }}</p>
          <p class="mt-1 text-xs uppercase tracking-wide text-gray-500">Followers</p>
        </div>
        <div class="rounded-lg border border-white/10 bg-neutral-900 p-6 text-center shadow">
          <p class="text-4xl font-bold text-cyan-400">{{ team.players?.length ?? 0 }}</p>
          <p class="mt-1 text-xs uppercase tracking-wide text-gray-500">Players</p>
        </div>
      </div>

      <div class="rounded-lg border border-white/10 bg-neutral-900 p-6 shadow">
        <h2 class="mb-4 text-lg font-semibold text-white">Team information</h2>
        <div class="divide-y divide-white/10">
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Name</span>
            <span class="font-medium text-white">{{ team.name }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Country</span>
            <span class="font-medium text-white">{{ team.country }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Followers</span>
            <span class="font-medium text-white">{{ formattedFollowers }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Created</span>
            <span class="font-medium text-white">{{ formattedCreatedAt }}</span>
          </div>
          <div class="flex justify-between py-3">
            <span class="text-gray-400">Updated</span>
            <span class="font-medium text-white">{{ formattedUpdatedAt }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-white/10 bg-neutral-900 p-6 shadow">
        <h2 class="mb-4 text-lg font-semibold text-white">Roster</h2>
        <p v-if="!team.players || team.players.length === 0" class="text-sm text-gray-400">
          This team has no players yet.
        </p>
        <ul v-else class="divide-y divide-white/10">
          <li v-for="player in team.players" :key="player.id" class="flex justify-between py-3">
            <RouterLink
              :to="{ name: 'player', params: { id: player.id } }"
              class="font-medium text-cyan-300 hover:text-cyan-200"
            >
              {{ player.name }}
            </RouterLink>
            <span class="text-gray-400">{{ player.role }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
