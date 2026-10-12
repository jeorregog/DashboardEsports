import './assets/css/input.css';

// external imports
import { createApp } from 'vue';

// internal imports
import { ApiClient } from './services/ApiClient.js';
import App from './App.vue';
import PiniaConfig from './PiniaConfig.js';
import router from './router';
import { useAuthStore } from './stores/auth.store.js';

const app = createApp(App);

app.use(PiniaConfig.init());
app.use(router);

// Expired or invalid token: clear the session and send the user to the login page.
ApiClient.setUnauthorizedHandler(() => {
  useAuthStore().logout();

  const currentRoute = router.currentRoute.value;

  if (currentRoute.name !== 'login') {
    router.push({ name: 'login', query: { redirect: currentRoute.fullPath } });
  }
});

app.mount('#app');
