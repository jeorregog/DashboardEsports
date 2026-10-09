// external imports
import { createRouter, createWebHistory } from 'vue-router';

// internal imports
import AboutView from '@/views/AboutView.vue';
import HomeView from '@/views/HomeView.vue';
import PlayersFormView from '@/views/PlayersFormView.vue';
import PlayersIndexView from '@/views/PlayersIndexView.vue';
import PlayersShowView from '@/views/PlayersShowView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Home' } },
    { path: '/about', name: 'about', component: AboutView, meta: { title: 'About' } },
    { path: '/players', name: 'players', component: PlayersIndexView, meta: { title: 'Players' } },
    { path: '/players/create', name: 'players.create', component: PlayersFormView, meta: { title: 'Create Player' } },
    { path: '/players/:id/edit', name: 'players.edit', component: PlayersFormView, meta: { title: 'Edit Player' } },
    { path: '/players/:id', name: 'player', component: PlayersShowView, meta: { title: 'Player' } },
  ],
});

export default router;
