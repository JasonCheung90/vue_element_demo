import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './element'
import 'element-ui/lib/theme-chalk/index.css'
import ZkTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.component(ZkTable.name, ZkTable)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
