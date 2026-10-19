import '@phosphor-icons/web/regular';
import './main.css';

import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(PrimeVue);
app.use(pinia);
app.mount('#app');
