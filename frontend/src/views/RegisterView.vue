<script setup lang="ts">
// external imports
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// internal imports
import AuthValidator from '@/utils/AuthValidator.js';
import RedirectResolver from '@/utils/RedirectResolver.js';
import { useAuthStore } from '@/stores/auth.store.js';

// --- Types ---
interface RegisterFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// --- State ---
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const formError = ref('');

const form = reactive<RegisterFormState>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

// --- Methods ---
async function handleSubmit() {
  formError.value = '';

  const username = form.username.trim();
  const email = form.email.trim();

  if (!username || !email || !form.password || !form.confirmPassword) {
    formError.value = 'Fill in all required fields.';
    return;
  }

  if (!AuthValidator.isValidEmail(email)) {
    formError.value = 'Enter a valid email address.';
    return;
  }

  if (!AuthValidator.isValidPassword(form.password)) {
    formError.value = `Password must be at least ${AuthValidator.MIN_PASSWORD_LENGTH} characters long.`;
    return;
  }

  if (form.password !== form.confirmPassword) {
    formError.value = 'Passwords do not match.';
    return;
  }

  // The payload never includes isAdmin: public registration always creates a regular user.
  const isRegistered = await authStore.register({ username, email, password: form.password });

  if (!isRegistered) {
    formError.value = authStore.error;
    return;
  }

  await router.push(RedirectResolver.resolve(route.query.redirect));
}
</script>

<template>
  <section>
    <div class="mx-auto max-w-md space-y-8">
      <div>
        <p class="text-sm font-semibold uppercase text-cyan-300">Join the dashboard</p>
        <h1 class="mt-1 text-3xl font-bold text-white">Create account</h1>
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
          <label for="register-username" class="block text-sm font-medium text-gray-300"
            >Username</label
          >
          <input
            id="register-username"
            v-model.trim="form.username"
            type="text"
            autocomplete="username"
            required
            class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div>
          <label for="register-email" class="block text-sm font-medium text-gray-300">Email</label>
          <input
            id="register-email"
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            required
            class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div>
          <label for="register-password" class="block text-sm font-medium text-gray-300"
            >Password</label
          >
          <input
            id="register-password"
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            required
            class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div>
          <label for="register-confirm-password" class="block text-sm font-medium text-gray-300">
            Confirm password
          </label>
          <input
            id="register-confirm-password"
            v-model="form.confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="inline-flex w-full items-center justify-center rounded bg-cyan-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ authStore.loading ? 'Creating account...' : 'Register' }}
        </button>

        <p class="text-center text-sm text-gray-400">
          Already have an account?
          <RouterLink
            :to="{ name: 'login' }"
            class="font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Log in
          </RouterLink>
        </p>
      </form>
    </div>
  </section>
</template>
