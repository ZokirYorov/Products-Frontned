import { createApp } from 'vue'
import './style.css'
import { createPinia} from 'pinia';
import App from './App.vue'
import router from './router'
import clickOutside  from "@/directives/clickOutside";

const pinia = createPinia();


createApp(App)
    .use(router)
    .use(pinia)
    .directive('clickOutside', clickOutside)
    .mount('#app')
