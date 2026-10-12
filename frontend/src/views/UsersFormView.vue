<script setup lang="ts">
// external imports
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// internal imports
import ApiErrorParser from '@/utils/ApiErrorParser.js';
import AuthValidator from '@/utils/AuthValidator.js';
import type { CreateUserDTO, UpdateUserDTO } from '@/dtos/UserDTOS.js';
import { UserService } from '@/services/UserService.js';

// --- Types ---
interface UserFormState {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

// --- State ---
const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);
const formError = ref('');

const form = reactive<UserFormState>({
  username: '',
  email: '',
  password: '',
  isAdmin: false,
});

// --- Computed ---
const isEditMode = computed(() => Boolean(route.params.id));
const pageTitle = computed(() => (isEditMode.value ? 'Edit User' : 'Create User'));
const passwordLabel = computed(() => (isEditMode.value ? 'New password (optional)' : 'Password'));
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
    const username = form.username.trim();
    const email = form.email.trim();

    if (!username || !email) {
      formError.value = 'Fill in all required fields.';
      return;
    }

    if (!AuthValidator.isValidEmail(email)) {
      formError.value = 'Enter a valid email address.';
      return;
    }

    if (isEditMode.value) {
      // An empty password means "keep the current one", so it is left out of the payload.
      if (form.password && !AuthValidator.isValidPassword(form.password)) {
        formError.value = `Password must be at least ${AuthValidator.MIN_PASSWORD_LENGTH} characters long.`;
        return;
      }

      const payload: UpdateUserDTO = { username, email, isAdmin: form.isAdmin };

      if (form.password) {
        payload.password = form.password;
      }

      await UserService.update(Number(route.params.id), payload);
    } else {
      if (!AuthValidator.isValidPassword(form.password)) {
        formError.value = `Password must be at least ${AuthValidator.MIN_PASSWORD_LENGTH} characters long.`;
        return;
      }

      const payload: CreateUserDTO = {
        username,
        email,
        password: form.password,
        isAdmin: form.isAdmin,
      };
      await UserService.create(payload);
    }

    router.push({ name: 'admin.users' });
  } catch (error: unknown) {
    formError.value = ApiErrorParser.getMessage(error, 'Unable to save the user.');
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
    const user = await UserService.getById(Number(route.params.id));
    form.username = user.username;
    form.email = user.email;
    form.isAdmin = user.isAdmin;
  } catch (error: unknown) {
    formError.value = ApiErrorParser.getMessage(error, 'Unable to load the user.');
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
            <label for="user-username" class="block text-sm font-medium text-gray-300"
              >Username</label
            >
            <input
              id="user-username"
              v-model.trim="form.username"
              type="text"
              required
              class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label for="user-email" class="block text-sm font-medium text-gray-300">Email</label>
            <input
              id="user-email"
              v-model.trim="form.email"
              type="email"
              required
              class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        <div>
          <label for="user-password" class="block text-sm font-medium text-gray-300">{{
            passwordLabel
          }}</label>
          <input
            id="user-password"
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            :required="!isEditMode"
            class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <label class="flex items-center gap-3 text-sm font-medium text-gray-300">
          <input
            v-model="form.isAdmin"
            type="checkbox"
            class="h-4 w-4 rounded border-white/10 bg-neutral-950 accent-cyan-400"
          />
          Administrator
        </label>

        <div class="flex items-center justify-end gap-3">
          <RouterLink
            :to="{ name: 'admin.users' }"
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
