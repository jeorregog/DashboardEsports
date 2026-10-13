<script setup lang="ts">
// external imports
import { computed, onMounted, ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

// internal imports
import ApiErrorParser from '@/utils/ApiErrorParser.js';
import ChartPanel from '@/components/common/ChartPanel.vue';
import DataTable, { type ColumnDefinition } from '@/components/common/DataTable.vue';
import FilterSelect, { type SelectOption } from '@/components/common/FilterSelect.vue';
import TeamChartBuilder from '@/utils/TeamChartBuilder.js';
import type { TeamInterface } from '@/interfaces/TeamInterface.js';
import { TeamService } from '@/services/TeamService.js';
import { useAuthStore } from '@/stores/auth.store.js';

// --- Types ---
// View-model row rendered by the DataTable; numeric fields are pre-formatted strings.
interface TeamRow {
  id: number;
  name: string;
  country: string;
  followers: string;
  players: string;
}

// --- State ---
const router = useRouter();
const authStore = useAuthStore();
const teams = ref<TeamInterface[]>([]);
const selectedCountryFilter = ref<string>('');
const isLoading = ref(false);
const pageError = ref('');

const teamColumns: ColumnDefinition<TeamRow>[] = [
  { key: 'name', label: 'Name' },
  { key: 'country', label: 'Country' },
  { key: 'followers', label: 'Followers' },
  { key: 'players', label: 'Players' },
];

// --- Computed ---
const countryFilterOptions = computed<SelectOption[]>(() => {
  const distinctCountries = [...new Set(teams.value.map((team) => team.country))];

  return [
    { label: 'All', value: '' },
    ...distinctCountries.map((country) => ({ label: country, value: country })),
  ];
});

const filteredTeams = computed(() =>
  teams.value.filter(
    (team) => selectedCountryFilter.value === '' || team.country === selectedCountryFilter.value,
  ),
);

const teamRows = computed<TeamRow[]>(() =>
  filteredTeams.value.map((team) => ({
    id: team.id,
    name: team.name,
    country: team.country,
    followers: team.followers.toLocaleString('en-US'),
    players: String(team.players?.length ?? 0),
  })),
);

const followersChartData = computed(() => TeamChartBuilder.followersByTeam(filteredTeams.value));

// --- Methods ---
async function loadTeams() {
  isLoading.value = true;
  pageError.value = '';

  try {
    teams.value = await TeamService.getAll();
  } catch (error: unknown) {
    pageError.value = ApiErrorParser.getMessage(error, 'Unable to load the teams.');
  } finally {
    isLoading.value = false;
  }
}

function goToShow(row: TeamRow) {
  router.push({ name: 'team', params: { id: row.id } });
}

function goToEdit(row: TeamRow) {
  router.push({ name: 'teams.edit', params: { id: row.id } });
}

async function handleDeleteTeam(row: TeamRow) {
  pageError.value = '';

  if (!window.confirm(`Delete team "${row.name}"?`)) {
    return;
  }

  try {
    await TeamService.delete(row.id);
    await loadTeams();
  } catch (error: unknown) {
    pageError.value = ApiErrorParser.getMessage(error, 'Unable to delete the team.');
  }
}

// --- Lifecycle ---
onMounted(async () => {
  await loadTeams();
});
</script>

<template>
  <section>
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase text-cyan-300">Competition</p>
        <h1 class="mt-1 text-3xl font-bold text-white">Teams</h1>
        <p class="mt-2 max-w-2xl text-sm text-gray-400">
          Browse teams, their country, followers, and rosters.
        </p>
      </div>
      <RouterLink
        v-if="authStore.isAdmin"
        :to="{ name: 'teams.create' }"
        class="inline-flex items-center justify-center gap-2 rounded bg-cyan-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-300"
      >
        <Plus class="h-4 w-4" />
        New team
      </RouterLink>
    </div>

    <section class="mb-6 rounded-lg border border-white/10 bg-white p-5 text-gray-900 shadow">
      <FilterSelect
        v-model="selectedCountryFilter"
        label="Country"
        :options="countryFilterOptions"
      />
    </section>

    <p
      v-if="pageError"
      class="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ pageError }}
    </p>

    <p v-if="isLoading" class="text-sm text-gray-400">Loading teams...</p>

    <div v-else class="space-y-6">
      <ChartPanel title="Followers by team" type="bar" :chart-data="followersChartData" />

      <DataTable
        :columns="teamColumns"
        :data="teamRows"
        show-view
        :show-actions="authStore.isAdmin"
        @view="goToShow"
        @edit="goToEdit"
        @delete="handleDeleteTeam"
      />
    </div>
  </section>
</template>
