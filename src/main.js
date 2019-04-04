import Vue from 'vue'
import iView from 'iview'
import './theme/index.less'
import VueI18n from 'vue-i18n'

import App from './App.vue'
import routerInstance from './router'
import storeInstance from './store'
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

// 注册插件
Vue.use(iView, {
  transfer: true
})
Vue.use(VueI18n)
Vue.use(components)

// 注册全局 utils
Vue.prototype.$utils = utils
// 注册全局 config
Vue.prototype.$config = config
// 注册 $http
Vue.prototype.$http = http

console.log('process.env.API_BASE', process.env)

new Vue({
  store: storeInstance,
  router: routerInstance,
  render: h => h(App)
}).$mount('#app')
