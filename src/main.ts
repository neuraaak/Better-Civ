// Self-hosted fonts: subsets are served with unicode-range, so browsers only fetch what they render
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './main.css';

import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
