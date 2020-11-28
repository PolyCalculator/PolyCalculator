import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, LayoutPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../public/stats.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(LayoutPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')