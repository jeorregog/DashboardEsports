<script setup lang="ts">
// external imports
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// internal imports
import ApiErrorParser from '@/utils/ApiErrorParser.js';
import type { CreateTeamDTO, UpdateTeamDTO } from '@/dtos/TeamDTOS.js';
import TeamFormValidator from '@/utils/TeamFormValidator.js';
import { TeamService } from '@/services/TeamService.js';

// --- Types ---
interface TeamFormState {
  name: string;
  followers: number;
  country: string;
}

// --- State ---
const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);
const formError = ref('');

const form = reactive<TeamFormState>({
  name: '',
  followers: 0,
  country: '',
});

// --- Computed ---
const isEditMode = computed(() => Boolean(route.params.id));
const pageTitle = computed(() => (isEditMode.value ? 'Edit Team' : 'Create Team'));
const submitLabel = computed(() => {
  if (isSubmitting.value) {
    return 'Saving...';
  }

  return isEditMode.value ? 'Update' : 'Create';
});

// --- Methods ---
async function handleSubmit() {
  formError.value = '';

  const payload: CreateTeamDTO = {
    name: form.name.trim(),
    followers: form.followers,
    country: form.country.trim(),
  };

  const validationError = TeamFormValidator.validate(payload);

  if (validationError) {
    formError.value = validationError;
    return;
  }

  isSubmitting.value = true;

  try {
    if (isEditMode.value) {
      await TeamService.update(Number(route.params.id), payload as UpdateTeamDTO);
    } else {
      await TeamService.create(payload);
    }

    router.push({ name: 'teams' });
  } catch (error: unknown) {
    formError.value = ApiErrorParser.getMessage(error, 'Unable to save the team.');
  } finally {
    isSubmitting.value = false;
  }
}

// --- Lifecycle ---
onMounted(async () => {
  if (!isEditMode.value) {
    return;
  }

  try {
    const team = await TeamService.getById(Number(route.params.id));
    form.name = team.name;
    form.followers = team.followers;
    form.country = team.country;
  } catch (error: unknown) {
    formError.value = ApiErrorParser.getMessage(error, 'Unable to load the team.');
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

        <div>
          <label for="team-name" class="block text-sm font-medium text-gray-300">Name</label>
          <input
            id="team-name"
            v-model.trim="form.name"
            type="text"
            required
            class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="team-country" class="block text-sm font-medium text-gray-300"
              >Country</label
            >
            <input
              id="team-country"
              v-model.trim="form.country"
              type="text"
              required
              class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label for="team-followers" class="block text-sm font-medium text-gray-300"
              >Followers</label
            >
            <input
              id="team-followers"
              v-model.number="form.followers"
              type="number"
              min="0"
              required
              class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3">
          <RouterLink
            :to="{ name: 'teams' }"
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
