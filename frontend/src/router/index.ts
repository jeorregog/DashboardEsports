// external imports
import { createRouter, createWebHistory } from 'vue-router';

// internal imports
import AboutView from '@/views/AboutView.vue';
import AdminPlayersView from '@/views/AdminPlayersView.vue';
import AdminUsersView from '@/views/AdminUsersView.vue';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import MatchesFormView from '@/views/MatchesFormView.vue';
import MatchesIndexView from '@/views/MatchesIndexView.vue';
import MatchesShowView from '@/views/MatchesShowView.vue';
import PlayersFormView from '@/views/PlayersFormView.vue';
import PlayersIndexView from '@/views/PlayersIndexView.vue';
import PlayersShowView from '@/views/PlayersShowView.vue';
import RegisterView from '@/views/RegisterView.vue';
import TeamsFormView from '@/views/TeamsFormView.vue';
import TeamsIndexView from '@/views/TeamsIndexView.vue';
import TeamsShowView from '@/views/TeamsShowView.vue';
import { useAuthStore } from '@/stores/auth.store.js';
import UsersFormView from '@/views/UsersFormView.vue';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    // Routes require authentication unless they explicitly set requiresAuth: false.
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Login', requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Register', requiresAuth: false },
    },

    // Authenticated routes
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Home', requiresAuth: true } },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { title: 'About', requiresAuth: true },
    },
    {
      path: '/players',
      name: 'players',
      component: PlayersIndexView,
      meta: { title: 'Players', requiresAuth: true },
    },
    {
      path: '/players/create',
      name: 'players.create',
      component: PlayersFormView,
      meta: { title: 'Create Player', requiresAuth: true },
    },
    {
      path: '/players/:id/edit',
      name: 'players.edit',
      component: PlayersFormView,
      meta: { title: 'Edit Player', requiresAuth: true },
    },
    {
      path: '/players/:id',
      name: 'player',
      component: PlayersShowView,
      meta: { title: 'Player', requiresAuth: true },
    },

    {
      path: '/teams',
      name: 'teams',
      component: TeamsIndexView,
      meta: { title: 'Teams', requiresAuth: true },
    },
    {
      path: '/teams/create',
      name: 'teams.create',
      component: TeamsFormView,
      meta: { title: 'Create Team', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/teams/:id/edit',
      name: 'teams.edit',
      component: TeamsFormView,
      meta: { title: 'Edit Team', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/teams/:id',
      name: 'team',
      component: TeamsShowView,
      meta: { title: 'Team', requiresAuth: true },
    },
    {
      path: '/matches',
      name: 'matches',
      component: MatchesIndexView,
      meta: { title: 'Matches', requiresAuth: true },
    },
    {
      path: '/matches/create',
      name: 'matches.create',
      component: MatchesFormView,
      meta: { title: 'Create Match', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/matches/:id/edit',
      name: 'matches.edit',
      component: MatchesFormView,
      meta: { title: 'Edit Match', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/matches/:id',
      name: 'match',
      component: MatchesShowView,
      meta: { title: 'Match', requiresAuth: true },
    },

    // Admin routes
    {
      path: '/admin/players',
      name: 'admin.players',
      component: AdminPlayersView,
      meta: { title: 'Admin Players', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/users',
      name: 'admin.users',
      component: AdminUsersView,
      meta: { title: 'Users', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/users/create',
      name: 'admin.users.create',
      component: UsersFormView,
      meta: { title: 'Create User', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/users/:id/edit',
      name: 'admin.users.edit',
      component: UsersFormView,
      meta: { title: 'Edit User', requiresAuth: true, requiresAdmin: true },
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  authStore.initializeAuth();

  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: to.fullPath === '/' ? undefined : { redirect: to.fullPath } };
  }

  // Logged-in users have no reason to see the login/register pages.
  if (!requiresAuth && authStore.isAuthenticated) {
    return { name: 'home' };
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: 'home' };
  }

  return true;
});

export default router;
