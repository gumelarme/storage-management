import Vue from 'vue'
import App from './App.vue'
import "@/assets/css/tailwind.css"
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'

//page 
import Login from './pages/Login.vue'
import Manager from './pages/Manager.vue'
import Provider from './pages/Provider.vue'
import Warehouses from './pages/Warehouses.vue'
import Goods from './pages/Goods.vue'
import Storages from './pages/Storages.vue'
import NotFound from './pages/NotFound.vue'
import AsyncComputed from 'vue-async-computed'

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(AsyncComputed)
Vue.use(VueCookies);

const routes = [
  {path: "/", component: Storages},
  {path: "/login", component: Login},
  {path: "/managers", component: Manager},
  {path: "/providers", component: Provider},
  {path: "/warehouses", component: Warehouses},
  {path: "/goods", component: Goods},
  {path: "/storages", component:  Storages},
  {path: "/404", component: NotFound},
  {path: "*", component: NotFound},

];

const router = new VueRouter({routes});

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
