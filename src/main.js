import Vue from 'vue'
import iView from 'iview'
import './theme/index.less'
import * as Cookies from 'js-cookie'

import App from './App.vue'
import i18n from './i18n'
import router from './router'
import store from './store'
import './registerServiceWorker'

import utils from './global/utils'
import components from './global/components'
import config from './config'
import http from './http'

// Vue 全局配置
let isDev = process && process.env.NODE_ENV !== 'production'
Vue.config.debug = isDev
Vue.config.devtools = isDev
Vue.config.productionTip = isDev
Vue.config.performance = isDev
// 挂载 $X 命名空间
Vue.prototype.$X = {
  isDev,
  utils,
  config,
  http,
  Cookies
}

// 注册插件
Vue.use(iView, {
  transfer: true
})
// 注册全局组件
Vue.use(components)

new Vue({
  i18n: i18n(Vue),
  store: store(Vue),
  router: router(Vue),
  render: h => h(App)
}).$mount('#app')
