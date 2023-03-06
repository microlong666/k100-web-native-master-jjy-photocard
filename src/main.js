import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 标识二开环境
if (process.env.NODE_ENV !== 'production') {
  window.__$$xtNativeDev = true
}

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
