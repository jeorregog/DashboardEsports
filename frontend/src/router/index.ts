import AboutView from '@/views/AboutView.vue';
import HomeView from '@/views/HomeView.vue';
import PlayersIndexView from '@/views/PlayersIndexView.vue';
import PlayersShowView from '@/views/PlayersShowView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Home' } },
    { path: '/about', name: 'about', component: AboutView, meta: { title: 'About' } },
    { path: '/players', name: 'players', component: PlayersIndexView, meta: { title: 'Players' } },
    { path: '/players/:id', name: 'player', component: PlayersShowView, meta: { title: 'Player' } },
  ],
});

export default router;
