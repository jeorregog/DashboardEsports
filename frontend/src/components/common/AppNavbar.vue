<script setup lang="ts">
// external imports
import { computed } from 'vue';
import { Gamepad2, Home, Info, LogIn, LogOut, ShieldCheck, UserPlus, Users } from 'lucide-vue-next';
import { RouterLink, useRouter } from 'vue-router';

// internal imports
import { useAuthStore } from '@/stores/auth.store.js';

// AppNavbar: top navigation. Admin links are only rendered when the session is an administrator.
const router = useRouter();
const authStore = useAuthStore();

const navLinkClass =
  'inline-flex h-9 shrink-0 items-center gap-2 rounded px-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/10 hover:text-white';
const activeNavLinkClass =
  '!bg-cyan-400 !text-neutral-950 shadow shadow-cyan-500/20 hover:!bg-cyan-300 hover:!text-neutral-950';

// The admin players route is registered by the Player admin work; hide the link until it exists.
const hasAdminPlayersRoute = computed(() => router.hasRoute('admin.players'));

async function handleLogout() {
  authStore.logout();
  await router.push({ name: 'login' });
}
</script>

<template>
  <nav class="border-b border-white/10 bg-neutral-950 text-white">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8"
    >
      <RouterLink to="/" class="inline-flex items-center gap-2 text-lg font-bold text-white">
        <Gamepad2 class="h-5 w-5 text-cyan-300" />
        E-Sports Dashboard
      </RouterLink>

      <div class="flex flex-wrap items-center gap-2">
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/" :class="navLinkClass" :exact-active-class="activeNavLinkClass">
            <Home class="h-4 w-4" />
            Home
          </RouterLink>
          <RouterLink to="/players" :class="navLinkClass" :exact-active-class="activeNavLinkClass">
            <Users class="h-4 w-4" />
            Players
          </RouterLink>
          <RouterLink to="/about" :class="navLinkClass" :exact-active-class="activeNavLinkClass">
            <Info class="h-4 w-4" />
            About
          </RouterLink>

          <template v-if="authStore.isAdmin">
            <RouterLink to="/admin/users" :class="navLinkClass" :active-class="activeNavLinkClass">
              <ShieldCheck class="h-4 w-4" />
              Admin Users
            </RouterLink>
            <RouterLink
              v-if="hasAdminPlayersRoute"
              to="/admin/players"
              :class="navLinkClass"
              :active-class="activeNavLinkClass"
            >
              <ShieldCheck class="h-4 w-4" />
              Admin Players
            </RouterLink>
          </template>

          <span class="px-2 text-sm text-gray-400">{{ authStore.currentUser?.username }}</span>
          <button type="button" :class="navLinkClass" @click="handleLogout">
            <LogOut class="h-4 w-4" />
            Logout
          </button>
        </template>

        <template v-else>
          <RouterLink to="/login" :class="navLinkClass" :exact-active-class="activeNavLinkClass">
            <LogIn class="h-4 w-4" />
            Login
          </RouterLink>
          <RouterLink to="/register" :class="navLinkClass" :exact-active-class="activeNavLinkClass">
            <UserPlus class="h-4 w-4" />
            Register
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>
