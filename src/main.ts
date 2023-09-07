import "reflect-metadata";

import {createApp} from 'vue'
import App from '@/App.vue'
import router from './router/router';

import {IonicVue} from '@ionic/vue';

// Import i18n
import {i18n} from "@/locals/i18n";

// Import pinia
import {createPinia} from 'pinia'

// Import database
import {initDb} from '@/data/database/init/init-db';

// Import database stores
import {useDatabaseStores} from '@/stores/database-stores';

// Some global components
import 'overlayscrollbars/overlayscrollbars.css';
import VStickyElement from 'vue-sticky-element';
import VScrollThreshold from 'v-scroll-threshold';
import drag from "v-drag"

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import '@/assets/styles/main.less';

/* Open Color */
import 'open-color/open-color.css';

const app = createApp(App)
    .use(IonicVue, {
        mode: 'ios',
    })
    .use(router)
    .use(i18n)
    .use(drag, {
        removeTransition: false
    })
    .use(VScrollThreshold)
    .use(VStickyElement)
    .use(createPinia())
;


// Use database stores
const dbStores = useDatabaseStores();

initDb(dbStores).then(() => {
    router.isReady().then(() => {
        // Mount Vue app
        app.mount('#app')
    });
});




