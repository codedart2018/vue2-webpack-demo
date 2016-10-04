import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Mc from './mc.vue'
// import less from './test.less'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/test',
    component: Mc
  }, {
    path: '/',
    component: Mc
  }]
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
