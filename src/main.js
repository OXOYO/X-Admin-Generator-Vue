import Vue from 'vue'
import VueRouter from 'vue-router'
import iView from 'iview'
import './theme/index.less'
import Vuebar from 'vuebar'
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
// store实例
const storeInstance = store(Vue)

// 挂载 $X 命名空间
Vue.prototype.$X = {
  isDev,
  utils,
  config,
  http,
  Cookies,
  storeInstance
}
// 注册插件
Vue.use(iView, {
  transfer: true
})
// 注册滚动条指令
Vue.use(Vuebar)
// 注册全局组件
Vue.use(components)
// 获取路由
router(Vue).then(function (routeArr) {
  // 注册路由
  Vue.use(VueRouter)
  // 路由实例
  const routerInstance = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routeArr,
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      } else {
        const position = {}
        if (to.hash) {
          position.selector = to.hash
        }
        if (to.matched.some(m => m.meta.scrollToTop)) {
          position.x = 0
          position.y = 0
        }
        return position
      }
    }
  })
  console.log('routerInstance.options.routes', routerInstance.options.routes)
  // 注册全局前置守卫
  routerInstance.beforeEach(async (to, from, next) => {
    console.log('to', to)
    console.log('from', from)
    Vue.prototype.$Loading.start()
    // 判断token信息是否过期
    let tokenKey = Vue.prototype.$X.config.cookie.getItem('token')
    let tokenVal = Vue.prototype.$X.Cookies.get(tokenKey)
    if (tokenVal) {
      next()
    } else {
      // 清除存储的信息
      Vue.prototype.$X.utils.storage.clear.apply(Vue.prototype)
      // 处理路由跳转
      if (['platform.admin'].includes(to.name)) {
        next({ name: 'platform.home' })
      } else {
        next()
      }
    }
  })
  // 注册全局后置钩子
  routerInstance.afterEach((to, from) => {
    Vue.prototype.$Loading.finish()
  })

  new Vue({
    i18n: i18n(Vue),
    store: storeInstance,
    router: routerInstance,
    render: h => h(App)
  }).$mount('#app')
})
