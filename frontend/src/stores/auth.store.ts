// external imports
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

// internal imports
import ApiErrorParser from '@/utils/ApiErrorParser.js';
import type { AuthResponseDTO, LoginDTO, RegisterDTO } from '@/dtos/AuthDTOS.js';
import { AuthService } from '@/services/AuthService.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';

// Session state only. Domain data (players, teams, matches, users) is never stored here.
export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  const token = ref<string | null>(null);
  const currentUser = ref<UserInterface | null>(null);
  const loading = ref(false);
  const error = ref('');
  const isInitialized = ref(false);

  // --- Getters ---
  const isAuthenticated = computed(() => token.value !== null && currentUser.value !== null);
  const isAdmin = computed(() => currentUser.value?.isAdmin === true);

  // --- Actions ---
  function loadCurrentUser(): void {
    currentUser.value = AuthService.loadCurrentUser();
    token.value = currentUser.value ? AuthService.getToken() : null;
  }

  // Restores the persisted session once, so it survives a browser reload.
  function initializeAuth(): void {
    if (isInitialized.value) {
      return;
    }

    loadCurrentUser();
    isInitialized.value = true;
  }

  async function authenticate(
    request: () => Promise<AuthResponseDTO>,
    fallbackMessage: string,
  ): Promise<boolean> {
    loading.value = true;
    error.value = '';

    try {
      const response = await request();
      token.value = response.token;
      currentUser.value = response.user;
      isInitialized.value = true;
      return true;
    } catch (caughtError: unknown) {
      error.value = ApiErrorParser.getMessage(caughtError, fallbackMessage);
      return false;
    } finally {
      loading.value = false;
    }
  }

  function login(dto: LoginDTO): Promise<boolean> {
    return authenticate(() => AuthService.login(dto), 'Unable to log in.');
  }

  function register(dto: RegisterDTO): Promise<boolean> {
    return authenticate(() => AuthService.register(dto), 'Unable to create the account.');
  }

  function logout(): void {
    AuthService.logout();
    token.value = null;
    currentUser.value = null;
    error.value = '';
  }

  return {
    token,
    currentUser,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    loadCurrentUser,
    initializeAuth,
    login,
    register,
    logout,
  };
});
