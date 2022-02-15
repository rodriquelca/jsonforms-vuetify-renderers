import Vue from 'vue';
import mitt from 'mitt';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './plugins';
import VueCompositionAPI from '@vue/composition-api';

Vue.use(VueCompositionAPI);
Vue.config.productionTip = false;
const emitter = mitt();
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
<<<<<<< HEAD
  provide: {
   emitter
  }
}).$mount('#app');
=======
}).$mount('#app');
>>>>>>> 4b153cb8c515b34f15202d64be0b66827cb4e695
