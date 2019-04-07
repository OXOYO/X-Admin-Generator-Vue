/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */
import Router from 'vue-router'

import home from './home'
import admin from './admin'

export default function (Vue) {
  // 注册路由
  Vue.use(Router)
  // TODO 动态注册路由
  const routeArr = [
    home,
    admin
  ]
  // 路由实例
  const routerInstance = new Router({
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
  // 注册全局前置守卫
  routerInstance.beforeEach((to, from, next) => {
    Vue.prototype.$Loading.start()
    next()
  })
  // 注册全局后置钩子
  routerInstance.afterEach((to, from) => {
    Vue.prototype.$Loading.finish()
  })

  return routerInstance
}
