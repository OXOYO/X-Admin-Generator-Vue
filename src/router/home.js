/**
 * Created by OXOYO on 2019/4/4.
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
  children: []
}
