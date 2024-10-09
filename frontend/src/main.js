import { createApp } from 'vue'
import App from './App.vue'
import './scss/main.scss'
import router from './router'
import i18n from './i18n'
import mixins from './mixins'
import store from './store'
import facebook from './facebook'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// import pinia from '@/sessionstorege/pinia'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import Multiselect from '@vueform/multiselect'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import VueQrcode from '@chenfengyuan/vue-qrcode';
import Vue3VideoPlayer from '@cloudgeek/vue3-video-player'
import '@cloudgeek/vue3-video-player/dist/vue3-video-player.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import Popper from "vue3-popper"
import { LoadingPlugin } from 'vue-loading-overlay';
// import LoadScript from 'vue-plugin-load-script';
// import bottomNavigationVue from "bottom-navigation-vue";
import bottomNavigationVue from "bottom-navigation-vue";
import "bottom-navigation-vue/dist/style.css";
// import { googleSdkLoaded } from "vue3-google-login";
import vue3GoogleLogin from 'vue3-google-login'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
library.add(fas, far, fab);
const app = createApp(App);
app.use(router);
app.mixin(mixins);
app.use(i18n);
app.use(store);
app.use(facebook);
app.use(VueSweetalert2);
app.use(VueDOMPurifyHTML);
app.use(Vue3VideoPlayer);
app.use(pinia)
app.use(LoadingPlugin)
app.use(bottomNavigationVue);

// app.use(LoadScript);
// app.use('icons')
app.use('transform-remove-console')
app.component('font-awesome-icon', FontAwesomeIcon);
app.component(Popper);
app.component(VueQrcode.name, VueQrcode);
app.mount('#app');
app.component(Multiselect)
app.use(vue3GoogleLogin, {
    clientId: process.env.VUE_APP_GOOGLE_API_KEY
  })

// window.Kakao.init("4e8af758d67dc31aec67a0f46e8b1f34");




