<script setup lang="ts">
// external imports
import { computed, onMounted, ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

// internal imports
import ApiErrorParser from '@/utils/ApiErrorParser.js';
import DataTable, { type ColumnDefinition } from '@/components/common/DataTable.vue';
import FilterSelect, { type SelectOption } from '@/components/common/FilterSelect.vue';
import { useAuthStore } from '@/stores/auth.store.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';
import { UserService } from '@/services/UserService.js';

// --- Types ---
// View-model row rendered by the DataTable. Passwords are never part of it.
interface UserRow {
  id: number;
  username: string;
  email: string;
  role: string;
}

// --- State ---
const router = useRouter();
const authStore = useAuthStore();
const users = ref<UserInterface[]>([]);
const selectedRoleFilter = ref<string>('');
const isLoading = ref(false);
const pageError = ref('');

const userColumns: ColumnDefinition<UserRow>[] = [
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
];

const roleFilterOptions: SelectOption[] = [
  { label: 'All', value: '' },
  { label: 'Administrator', value: 'Administrator' },
  { label: 'User', value: 'User' },
];

// --- Computed ---
const userRows = computed<UserRow[]>(() =>
  users.value
    .map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.isAdmin ? 'Administrator' : 'User',
    }))
    .filter((row) => selectedRoleFilter.value === '' || row.role === selectedRoleFilter.value),
);

// --- Methods ---
async function loadUsers() {
  isLoading.value = true;
  pageError.value = '';

  try {
    users.value = await UserService.getAll();
  } catch (error: unknown) {
    pageError.value = ApiErrorParser.getMessage(error, 'Unable to load the users.');
  } finally {
    isLoading.value = false;
  }
}

function goToEdit(row: UserRow) {
  router.push({ name: 'admin.users.edit', params: { id: row.id } });
}

async function handleDeleteUser(row: UserRow) {
  pageError.value = '';

  if (row.id === authStore.currentUser?.id) {
    pageError.value = 'You cannot delete your own account.';
    return;
  }

  if (!window.confirm(`Delete user "${row.username}"?`)) {
    return;
  }

  try {
    await UserService.delete(row.id);
    await loadUsers();
  } catch (error: unknown) {
    pageError.value = ApiErrorParser.getMessage(error, 'Unable to delete the user.');
  }
}

// --- Lifecycle ---
onMounted(async () => {
  await loadUsers();
});
</script>

<template>
  <section>
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase text-cyan-300">Administration</p>
        <h1 class="mt-1 text-3xl font-bold text-white">Users</h1>
        <p class="mt-2 max-w-2xl text-sm text-gray-400">
          Manage user accounts and administrator access.
        </p>
      </div>
      <RouterLink
        :to="{ name: 'admin.users.create' }"
        class="inline-flex items-center justify-center gap-2 rounded bg-cyan-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-300"
      >
        <Plus class="h-4 w-4" />
        New user
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

    <p v-if="isLoading" class="text-sm text-gray-400">Loading users...</p>

    <DataTable
      v-else
      :columns="userColumns"
      :data="userRows"
      show-actions
      @edit="goToEdit"
      @delete="handleDeleteUser"
    />
  </section>
</template>
