/**
 * Created by OXOYO on 2019/4/4.
 *
 * 系统后台路由
 */

export default {
  path: '/admin',
  name: 'platform.admin',
  component: () => import(/* webpackChunkName: 'Admin' */ '../platform/pages/AdminLayout'),
  meta: {
    title: '后台',
    requiresAuth: true,
    scrollToTop: true
  },
  // redirect: {
  //   name: 'platform.admin.Index'
  // },
  children: [
    {
      path: 'frame/:name',
      name: 'platform.admin.frame',
      component: () => import(/* webpackChunkName: 'FrameBox' */ '../platform/pages/FrameBox'),
      meta: {
        title: 'frame',
        requiresAuth: true,
        scrollToTop: true
      }
    },
    {
      path: 'error/:num',
      name: 'platform.admin.error',
      component: () => import(/* webpackChunkName: 'Error' */ '../platform/pages/Error'),
      meta: {
        title: 'error',
        requiresAuth: false,
        scrollToTop: true
      }
    }
  ]
}
