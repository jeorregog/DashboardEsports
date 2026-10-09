<script setup lang="ts">
// external imports
import { computed, onMounted, ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

// internal imports
import CurrencyFormatter from '@/utils/CurrencyFormatter.js';
import DataTable, { type ColumnDefinition } from '@/components/common/DataTable.vue';
import FilterSelect, { type SelectOption } from '@/components/common/FilterSelect.vue';
import type { PlayerInterface } from '@/interfaces/PlayerInterface.js';
import { PlayerService } from '@/services/PlayerService.js';

// --- Types ---
// View-model row rendered by the DataTable; numeric fields are pre-formatted strings.
interface PlayerRow {
  id: number;
  name: string;
  nickname: string;
  country: string;
  role: string;
  wins: string;
  earnings: string;
}

// --- State ---
const router = useRouter();
const players = ref<PlayerInterface[]>([]);
const selectedRoleFilter = ref<string>('');
const pageError = ref('');

const playerColumns: ColumnDefinition<PlayerRow>[] = [
  { key: 'name', label: 'Name' },
  { key: 'nickname', label: 'Nickname' },
  { key: 'country', label: 'Country' },
  { key: 'role', label: 'Role' },
  { key: 'wins', label: 'Wins' },
  { key: 'earnings', label: 'Earnings' },
];

// --- Computed ---
const roleFilterOptions = computed<SelectOption[]>(() => {
  const distinctRoles = [...new Set(players.value.map((player) => player.role))];

  return [{ label: 'All', value: '' }, ...distinctRoles.map((role) => ({ label: role, value: role }))];
});

const playerRows = computed<PlayerRow[]>(() =>
  players.value
    .filter((player) => selectedRoleFilter.value === '' || player.role === selectedRoleFilter.value)
    .map((player) => ({
      id: player.id,
      name: player.name,
      nickname: player.nickname,
      country: player.country,
      role: player.role,
      wins: String(player.wins),
      earnings: CurrencyFormatter.formatUsd(player.earnings),
    })),
);

// --- Methods ---
async function loadPlayers() {
  players.value = await PlayerService.getAll();
}

function goToEdit(row: PlayerRow) {
  router.push({ name: 'players.edit', params: { id: row.id } });
}

async function handleDeletePlayer(row: PlayerRow) {
  pageError.value = '';

  try {
    await PlayerService.delete(row.id);
    await loadPlayers();
  } catch (error: unknown) {
    pageError.value = error instanceof Error ? error.message : 'Unable to delete the player.';
  }
}

// --- Lifecycle ---
onMounted(async () => {
  await loadPlayers();
});
</script>

<template>
  <section>
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase text-cyan-300">Administration</p>
        <h1 class="mt-1 text-3xl font-bold text-white">Players</h1>
        <p class="mt-2 max-w-2xl text-sm text-gray-400">
          Manage players, performance, role, and country.
        </p>
      </div>
      <RouterLink
        :to="{ name: 'players.create' }"
        class="inline-flex items-center justify-center gap-2 rounded bg-cyan-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-300"
      >
        <Plus class="h-4 w-4" />
        New player
      </RouterLink>
    </div>

    <section class="mb-6 rounded-lg border border-white/10 bg-white p-5 text-gray-900 shadow">
      <FilterSelect v-model="selectedRoleFilter" label="Role" :options="roleFilterOptions" />
    </section>

    <p
      v-if="pageError"
      class="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ pageError }}
    </p>

    <DataTable
      :columns="playerColumns"
      :data="playerRows"
      show-actions
      @edit="goToEdit"
      @delete="handleDeletePlayer"
    />
  </section>
</template>
