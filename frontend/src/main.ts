import './assets/css/input.css';

// external imports
import { createApp } from 'vue';

// internal imports
import App from './App.vue';
import PiniaConfig from './PiniaConfig.js';
import router from './router';

const app = createApp(App);

app.use(PiniaConfig.init());
app.use(router);

app.mount('#app');
