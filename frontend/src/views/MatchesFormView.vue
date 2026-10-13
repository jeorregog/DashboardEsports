<script setup lang="ts">
// external imports
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// internal imports
import ApiErrorParser from '@/utils/ApiErrorParser.js';
import type { CreateMatchDTO, UpdateMatchDTO } from '@/dtos/MatchDTOS.js';
import DateInputConverter from '@/utils/DateInputConverter.js';
import FilterSelect, { type SelectOption } from '@/components/common/FilterSelect.vue';
import MatchFormValidator from '@/utils/MatchFormValidator.js';
import { MatchService } from '@/services/MatchService.js';
import type { TeamInterface } from '@/interfaces/TeamInterface.js';
import { TeamService } from '@/services/TeamService.js';

// --- Types ---
// Selects hold '' while nothing is chosen, otherwise the team id.
interface MatchFormState {
  game: string;
  date: string;
  team1Id: number | '';
  team2Id: number | '';
  winnerId: number | '';
}

// --- State ---
const route = useRoute();
const router = useRouter();
const teams = ref<TeamInterface[]>([]);
const isSubmitting = ref(false);
const formError = ref('');

const form = reactive<MatchFormState>({
  game: '',
  date: '',
  team1Id: '',
  team2Id: '',
  winnerId: '',
});

// --- Computed ---
const isEditMode = computed(() => Boolean(route.params.id));
const pageTitle = computed(() => (isEditMode.value ? 'Edit Match' : 'Create Match'));
const submitLabel = computed(() => {
  if (isSubmitting.value) {
    return 'Saving...';
  }

  return isEditMode.value ? 'Update' : 'Create';
});

const teamOptions = computed<SelectOption[]>(() =>
  teams.value.map((team) => ({ label: team.name, value: team.id })),
);

// The winner can only be one of the two teams that play the match.
const winnerOptions = computed<SelectOption[]>(() =>
  teamOptions.value.filter(
    (option) => option.value === form.team1Id || option.value === form.team2Id,
  ),
);

// --- Methods ---
// FilterSelect emits string | number; the form keeps ids as numbers.
function toTeamId(value: string | number): number {
  return Number(value);
}

function handleTeamChange(field: 'team1Id' | 'team2Id', value: string | number) {
  form[field] = toTeamId(value);

  // A winner that is no longer playing must be chosen again.
  if (form.winnerId !== form.team1Id && form.winnerId !== form.team2Id) {
    form.winnerId = '';
  }
}

async function handleSubmit() {
  formError.value = '';

  const payload: CreateMatchDTO = {
    game: form.game.trim(),
    date: DateInputConverter.toIso(form.date),
    team1Id: Number(form.team1Id),
    team2Id: Number(form.team2Id),
    winnerId: Number(form.winnerId),
  };

  const validationError = MatchFormValidator.validate(payload);

  if (validationError) {
    formError.value = validationError;
    return;
  }

  isSubmitting.value = true;

  try {
    if (isEditMode.value) {
      await MatchService.update(Number(route.params.id), payload as UpdateMatchDTO);
    } else {
      await MatchService.create(payload);
    }

    router.push({ name: 'matches' });
  } catch (error: unknown) {
    formError.value = ApiErrorParser.getMessage(error, 'Unable to save the match.');
  } finally {
    isSubmitting.value = false;
  }
}

// --- Lifecycle ---
onMounted(async () => {
  try {
    teams.value = await TeamService.getAll();

    if (!isEditMode.value) {
      return;
    }

    const match = await MatchService.getById(Number(route.params.id));
    form.game = match.game;
    form.date = DateInputConverter.toInputValue(match.date);
    form.team1Id = match.team1.id;
    form.team2Id = match.team2.id;
    form.winnerId = match.winner.id;
  } catch (error: unknown) {
    formError.value = ApiErrorParser.getMessage(error, 'Unable to load the match data.');
  }
});
</script>

<template>
  <section>
    <div class="mx-auto max-w-2xl space-y-8">
      <div>
        <p class="text-sm font-semibold uppercase text-cyan-300">Administration</p>
        <h1 class="mt-1 text-3xl font-bold text-white">{{ pageTitle }}</h1>
      </div>

      <form
        class="space-y-6 rounded-lg border border-white/10 bg-neutral-900 p-8 shadow"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <p
          v-if="formError"
          class="rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {{ formError }}
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="match-game" class="block text-sm font-medium text-gray-300">Game</label>
            <input
              id="match-game"
              v-model.trim="form.game"
              type="text"
              required
              class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label for="match-date" class="block text-sm font-medium text-gray-300">Date</label>
            <input
              id="match-date"
              v-model="form.date"
              type="datetime-local"
              required
              class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <FilterSelect
            :model-value="form.team1Id"
            label="Team 1"
            placeholder="Select a team"
            :options="teamOptions"
            class="rounded bg-white p-3"
            @update:model-value="handleTeamChange('team1Id', $event)"
          />
          <FilterSelect
            :model-value="form.team2Id"
            label="Team 2"
            placeholder="Select a team"
            :options="teamOptions"
            class="rounded bg-white p-3"
            @update:model-value="handleTeamChange('team2Id', $event)"
          />
        </div>

        <FilterSelect
          v-model="form.winnerId"
          label="Winner"
          placeholder="Select the winner"
          :options="winnerOptions"
          class="rounded bg-white p-3"
        />

        <div class="flex items-center justify-end gap-3">
          <RouterLink
            :to="{ name: 'matches' }"
            class="inline-flex items-center justify-center rounded border border-white/10 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5"
          >
            Cancel
          </RouterLink>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center justify-center rounded bg-cyan-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ submitLabel }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
