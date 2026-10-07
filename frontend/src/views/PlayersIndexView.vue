<script setup lang="ts">
import DataTable, { type ColumnDefinition } from '@/components/common/DataTable.vue';
import EntityFormModal from '@/components/common/EntityFormModal.vue';
import FilterSelect, { type SelectOption } from '@/components/common/FilterSelect.vue';
import type { CreatePlayerDTO } from '@/dtos/CreatePlayerDTO.js';
import type { UpdatePlayerDTO } from '@/dtos/UpdatePlayerDTO.js';
import type { PlayerInterface } from '@/interfaces/PlayerInterface.js';
import { PlayerService } from '@/services/PlayerService.js';
import { formatUsd } from '@/utils/currencyFormatter.js';
import { Plus } from 'lucide-vue-next';
import { computed, onMounted, reactive, ref } from 'vue';

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

interface PlayerFormState {
  name: string;
  nickname: string;
  wins: number;
  earnings: number;
  role: string;
  country: string;
}

// --- State ---
const players = ref<PlayerInterface[]>([]);
const selectedRoleFilter = ref<string>('');
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const selectedPlayerId = ref<number | null>(null);
const pageError = ref('');
const formError = ref('');

const playerForm = reactive<PlayerFormState>({
  name: '',
  nickname: '',
  wins: 0,
  earnings: 0,
  role: '',
  country: '',
});

const playerColumns: ColumnDefinition<PlayerRow>[] = [
  { key: 'name', label: 'Name' },
  { key: 'nickname', label: 'Nickname' },
  { key: 'country', label: 'Country' },
  { key: 'role', label: 'Role' },
  { key: 'wins', label: 'Wins' },
  { key: 'earnings', label: 'Earnings' },
];

// --- Computed ---
const modalTitle = computed(() => (selectedPlayerId.value ? 'Edit player' : 'New player'));
const modalSubmitText = computed(() => (selectedPlayerId.value ? 'Update' : 'Create'));

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
      earnings: formatUsd(player.earnings),
    })),
);

// --- Methods ---
async function loadPlayers() {
  players.value = await PlayerService.getPlayers();
}

function resetForm() {
  playerForm.name = '';
  playerForm.nickname = '';
  playerForm.wins = 0;
  playerForm.earnings = 0;
  playerForm.role = '';
  playerForm.country = '';
}

function openCreatePlayer() {
  pageError.value = '';
  formError.value = '';
  selectedPlayerId.value = null;
  resetForm();
  isModalOpen.value = true;
}

function openEditPlayer(row: PlayerRow) {
  const player = players.value.find((candidate) => candidate.id === row.id);

  if (!player) {
    pageError.value = 'Unable to find the selected player.';
    return;
  }

  pageError.value = '';
  formError.value = '';
  selectedPlayerId.value = player.id;
  playerForm.name = player.name;
  playerForm.nickname = player.nickname;
  playerForm.wins = player.wins;
  playerForm.earnings = player.earnings;
  playerForm.role = player.role;
  playerForm.country = player.country;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedPlayerId.value = null;
  formError.value = '';
  resetForm();
}

async function handleSubmitPlayer() {
  formError.value = '';
  isSubmitting.value = true;

  try {
    const name = playerForm.name.trim();
    const nickname = playerForm.nickname.trim();
    const role = playerForm.role.trim();
    const country = playerForm.country.trim();

    if (!name || !nickname || !role || !country) {
      formError.value = 'Fill in all required fields.';
      return;
    }

    if (
      !Number.isFinite(playerForm.wins) ||
      !Number.isInteger(playerForm.wins) ||
      playerForm.wins < 0 ||
      !Number.isFinite(playerForm.earnings) ||
      playerForm.earnings < 0
    ) {
      formError.value = 'Wins must be a non-negative integer and earnings a non-negative number.';
      return;
    }

    if (selectedPlayerId.value) {
      const payload: UpdatePlayerDTO = {
        name,
        nickname,
        wins: playerForm.wins,
        earnings: playerForm.earnings,
        role,
        country,
      };
      await PlayerService.updatePlayer(selectedPlayerId.value, payload);
    } else {
      const payload: CreatePlayerDTO = {
        name,
        nickname,
        wins: playerForm.wins,
        earnings: playerForm.earnings,
        role,
        country,
      };
      await PlayerService.createPlayer(payload);
    }

    await loadPlayers();
    closeModal();
  } catch (error: unknown) {
    formError.value = error instanceof Error ? error.message : 'Unable to save the player.';
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDeletePlayer(row: PlayerRow) {
  pageError.value = '';

  try {
    await PlayerService.deletePlayer(row.id);
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
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded bg-cyan-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-300"
        @click="openCreatePlayer"
      >
        <Plus class="h-4 w-4" />
        New player
      </button>
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
      @edit="openEditPlayer"
      @delete="handleDeletePlayer"
    />

    <EntityFormModal
      :is-open="isModalOpen"
      :title="modalTitle"
      :submit-text="modalSubmitText"
      :is-submitting="isSubmitting"
      @close="closeModal"
      @submit="handleSubmitPlayer"
    >
      <p
        v-if="formError"
        class="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ formError }}
      </p>

      <div>
        <label for="player-name" class="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="player-name"
          v-model.trim="playerForm.name"
          type="text"
          required
          class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label for="player-nickname" class="block text-sm font-medium text-gray-700">Nickname</label>
        <input
          id="player-nickname"
          v-model.trim="playerForm.nickname"
          type="text"
          required
          class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="player-wins" class="block text-sm font-medium text-gray-700">Wins</label>
          <input
            id="player-wins"
            v-model.number="playerForm.wins"
            type="number"
            min="0"
            required
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="player-earnings" class="block text-sm font-medium text-gray-700">Earnings</label>
          <input
            id="player-earnings"
            v-model.number="playerForm.earnings"
            type="number"
            min="0"
            required
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="player-role" class="block text-sm font-medium text-gray-700">Role</label>
          <input
            id="player-role"
            v-model.trim="playerForm.role"
            type="text"
            required
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="player-country" class="block text-sm font-medium text-gray-700">Country</label>
          <input
            id="player-country"
            v-model.trim="playerForm.country"
            type="text"
            required
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </EntityFormModal>
  </section>
</template>
