<script setup lang="ts">
// external imports
import { computed, onMounted, ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

// internal imports
import ApiErrorParser from '@/utils/ApiErrorParser.js';
import ChartPanel from '@/components/common/ChartPanel.vue';
import DataTable, { type ColumnDefinition } from '@/components/common/DataTable.vue';
import DateFormatter from '@/utils/DateFormatter.js';
import FilterSelect, { type SelectOption } from '@/components/common/FilterSelect.vue';
import MatchChartBuilder from '@/utils/MatchChartBuilder.js';
import type { MatchInterface } from '@/interfaces/MatchInterface.js';
import { MatchService } from '@/services/MatchService.js';
import { useAuthStore } from '@/stores/auth.store.js';

// --- Types ---
// View-model row rendered by the DataTable; related teams are flattened to their names.
interface MatchRow {
  id: number;
  game: string;
  date: string;
  team1: string;
  team2: string;
  winner: string;
}

// --- State ---
const router = useRouter();
const authStore = useAuthStore();
const matches = ref<MatchInterface[]>([]);
const selectedGameFilter = ref<string>('');
const isLoading = ref(false);
const pageError = ref('');

const matchColumns: ColumnDefinition<MatchRow>[] = [
  { key: 'game', label: 'Game' },
  { key: 'date', label: 'Date' },
  { key: 'team1', label: 'Team 1' },
  { key: 'team2', label: 'Team 2' },
  { key: 'winner', label: 'Winner' },
];

// --- Computed ---
const gameFilterOptions = computed<SelectOption[]>(() => {
  const distinctGames = [...new Set(matches.value.map((match) => match.game))];

  return [
    { label: 'All', value: '' },
    ...distinctGames.map((game) => ({ label: game, value: game })),
  ];
});

const filteredMatches = computed(() =>
  matches.value.filter(
    (match) => selectedGameFilter.value === '' || match.game === selectedGameFilter.value,
  ),
);

const matchRows = computed<MatchRow[]>(() =>
  filteredMatches.value.map((match) => ({
    id: match.id,
    game: match.game,
    date: DateFormatter.formatShortDate(match.date),
    team1: match.team1.name,
    team2: match.team2.name,
    winner: match.winner.name,
  })),
);

const winsChartData = computed(() => MatchChartBuilder.winsByTeam(filteredMatches.value));

// --- Methods ---
async function loadMatches() {
  isLoading.value = true;
  pageError.value = '';

  try {
    matches.value = await MatchService.getAll();
  } catch (error: unknown) {
    pageError.value = ApiErrorParser.getMessage(error, 'Unable to load the matches.');
  } finally {
    isLoading.value = false;
  }
}

function goToShow(row: MatchRow) {
  router.push({ name: 'match', params: { id: row.id } });
}

function goToEdit(row: MatchRow) {
  router.push({ name: 'matches.edit', params: { id: row.id } });
}

async function handleDeleteMatch(row: MatchRow) {
  pageError.value = '';

  if (!window.confirm(`Delete the ${row.game} match between ${row.team1} and ${row.team2}?`)) {
    return;
  }

  try {
    await MatchService.delete(row.id);
    await loadMatches();
  } catch (error: unknown) {
    pageError.value = ApiErrorParser.getMessage(error, 'Unable to delete the match.');
  }
}

// --- Lifecycle ---
onMounted(async () => {
  await loadMatches();
});
</script>

<template>
  <section>
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase text-cyan-300">Competition</p>
        <h1 class="mt-1 text-3xl font-bold text-white">Matches</h1>
        <p class="mt-2 max-w-2xl text-sm text-gray-400">
          Browse match results by game and see which teams win the most.
        </p>
      </div>
      <RouterLink
        v-if="authStore.isAdmin"
        :to="{ name: 'matches.create' }"
        class="inline-flex items-center justify-center gap-2 rounded bg-cyan-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-300"
      >
        <Plus class="h-4 w-4" />
        New match
      </RouterLink>
    </div>

    <section class="mb-6 rounded-lg border border-white/10 bg-white p-5 text-gray-900 shadow">
      <FilterSelect v-model="selectedGameFilter" label="Game" :options="gameFilterOptions" />
    </section>

    <p
      v-if="pageError"
      class="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ pageError }}
    </p>

    <p v-if="isLoading" class="text-sm text-gray-400">Loading matches...</p>

    <div v-else class="space-y-6">
      <ChartPanel title="Wins by team" type="doughnut" :chart-data="winsChartData" />

      <DataTable
        :columns="matchColumns"
        :data="matchRows"
        show-view
        :show-actions="authStore.isAdmin"
        @view="goToShow"
        @edit="goToEdit"
        @delete="handleDeleteMatch"
      />
    </div>
  </section>
</template>
