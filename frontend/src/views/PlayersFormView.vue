<script setup lang="ts">
// external imports
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// internal imports
import type { CreatePlayerDTO, UpdatePlayerDTO } from '@/dtos/PlayerDTOS.js';
import { PlayerService } from '@/services/PlayerService.js';

// --- Types ---
interface PlayerFormState {
  name: string;
  nickname: string;
  wins: number;
  earnings: number;
  role: string;
  country: string;
}

// --- State ---
const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);
const formError = ref('');

const form = reactive<PlayerFormState>({
  name: '',
  nickname: '',
  wins: 0,
  earnings: 0,
  role: '',
  country: '',
});

// --- Computed ---
const isEditMode = computed(() => Boolean(route.params.id));
const pageTitle = computed(() => (isEditMode.value ? 'Edit Player' : 'Create Player'));
const submitLabel = computed(() => {
  if (isSubmitting.value) {
    return 'Saving...';
  }

  return isEditMode.value ? 'Update' : 'Create';
});

// --- Methods ---
async function handleSubmit() {
  formError.value = '';
  isSubmitting.value = true;

  try {
    const name = form.name.trim();
    const nickname = form.nickname.trim();
    const role = form.role.trim();
    const country = form.country.trim();

    if (!name || !nickname || !role || !country) {
      formError.value = 'Fill in all required fields.';
      return;
    }

    if (
      !Number.isFinite(form.wins) ||
      !Number.isInteger(form.wins) ||
      form.wins < 0 ||
      !Number.isFinite(form.earnings) ||
      form.earnings < 0
    ) {
      formError.value = 'Wins must be a non-negative integer and earnings a non-negative number.';
      return;
    }

    const payload = {
      name,
      nickname,
      wins: form.wins,
      earnings: form.earnings,
      role,
      country,
    };

    if (isEditMode.value) {
      await PlayerService.update(Number(route.params.id), payload as UpdatePlayerDTO);
    } else {
      await PlayerService.create(payload as CreatePlayerDTO);
    }

    router.push({ name: 'players' });
  } catch (error: unknown) {
    formError.value = error instanceof Error ? error.message : 'Unable to save the player.';
  } finally {
    isSubmitting.value = false;
  }
}

// --- Lifecycle ---
onMounted(async () => {
  if (!isEditMode.value) {
    return;
  }

  const player = await PlayerService.getById(Number(route.params.id));
  form.name = player.name;
  form.nickname = player.nickname;
  form.wins = player.wins;
  form.earnings = player.earnings;
  form.role = player.role;
  form.country = player.country;
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
        @submit.prevent="handleSubmit"
      >
        <p
          v-if="formError"
          class="rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {{ formError }}
        </p>

        <div>
          <label for="player-name" class="block text-sm font-medium text-gray-300">Name</label>
          <input
            id="player-name"
            v-model.trim="form.name"
            type="text"
            required
            class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div>
          <label for="player-nickname" class="block text-sm font-medium text-gray-300">Nickname</label>
          <input
            id="player-nickname"
            v-model.trim="form.nickname"
            type="text"
            required
            class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="player-wins" class="block text-sm font-medium text-gray-300">Wins</label>
            <input
              id="player-wins"
              v-model.number="form.wins"
              type="number"
              min="0"
              required
              class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label for="player-earnings" class="block text-sm font-medium text-gray-300">Earnings</label>
            <input
              id="player-earnings"
              v-model.number="form.earnings"
              type="number"
              min="0"
              required
              class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="player-role" class="block text-sm font-medium text-gray-300">Role</label>
            <input
              id="player-role"
              v-model.trim="form.role"
              type="text"
              required
              class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label for="player-country" class="block text-sm font-medium text-gray-300">Country</label>
            <input
              id="player-country"
              v-model.trim="form.country"
              type="text"
              required
              class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3">
          <RouterLink
            :to="{ name: 'players' }"
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
