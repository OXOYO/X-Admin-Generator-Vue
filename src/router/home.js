/**
 * Created by yangfan9244 on 2019/4/4.
 *
 * 系统前台路由
 */

export default {
  path: '/',
  name: 'platform.home',
  component: () => import(/* webpackChunkName: 'Home' */ '../platform/pages/Home'),
  meta: {
    title: '首页',
    requiresAuth: false,
    scrollToTop: true
  },
  children: [
    {
      path: 'signin',
      name: 'platform.home.signin',
      component: () => import(/* webpackChunkName: 'SignIn' */ '../platform/pages/SignIn'),
      meta: {
        title: '登录',
        requiresAuth: false,
        scrollToTop: true
      }
    },
    {
      path: 'about',
      name: 'platform.home.about',
      component: () => import(/* webpackChunkName: 'About' */ '../platform/pages/About'),
      meta: {
        title: '关于',
        requiresAuth: false,
        scrollToTop: true
      }
    }
  ]
}
