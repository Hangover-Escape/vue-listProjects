// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store';

import 'lib-flexible/flexible.js'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
// import Popups from './utils/popups'
// import Request from './utils/request'
Vue.component( 'chart', ECharts )

// console.log(Store)
Vue.config.productionTip = false
Vue.use( Vuex );
// Vue.use(Popups)
// Vue.use(Request)
/* eslint-disable no-new */
new Vue( {
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
} );
