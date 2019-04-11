/**
 * Created by OXOYO on 2019/4/4.
 *
 * 系统后台路由
 */

export default {
  path: '/admin',
  name: 'platform.admin',
  component: () => import(/* webpackChunkName: 'Admin' */ '../platform/pages/Admin'),
  meta: {
    title: '后台',
    requiresAuth: true,
    scrollToTop: true
  },
  children: []
}
