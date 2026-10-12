<script setup lang="ts">
// external imports
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// internal imports
import AuthValidator from '@/utils/AuthValidator.js';
import RedirectResolver from '@/utils/RedirectResolver.js';
import { useAuthStore } from '@/stores/auth.store.js';

// --- Types ---
interface LoginFormState {
  email: string;
  password: string;
}

// --- State ---
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const formError = ref('');

const form = reactive<LoginFormState>({
  email: '',
  password: '',
});

// --- Methods ---
async function handleSubmit() {
  formError.value = '';

  const email = form.email.trim();

  if (!email || !form.password) {
    formError.value = 'Enter your email and password.';
    return;
  }

  if (!AuthValidator.isValidEmail(email)) {
    formError.value = 'Enter a valid email address.';
    return;
  }

  const isLoggedIn = await authStore.login({ email, password: form.password });

  if (!isLoggedIn) {
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
        <p class="text-sm font-semibold uppercase text-cyan-300">Welcome back</p>
        <h1 class="mt-1 text-3xl font-bold text-white">Log in</h1>
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
          <label for="login-email" class="block text-sm font-medium text-gray-300">Email</label>
          <input
            id="login-email"
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            required
            class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div>
          <label for="login-password" class="block text-sm font-medium text-gray-300"
            >Password</label
          >
          <input
            id="login-password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            required
            class="mt-1 w-full rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="inline-flex w-full items-center justify-center rounded bg-cyan-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ authStore.loading ? 'Logging in...' : 'Log in' }}
        </button>

        <p class="text-center text-sm text-gray-400">
          Don't have an account?
          <RouterLink
            :to="{ name: 'register' }"
            class="font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Register
          </RouterLink>
        </p>
      </form>
    </div>
  </section>
</template>
