/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'users',
  name: 'platform.admin.Users',
  dir: 'Users',
  component: () => import(/* webpackChunkName: 'Users' */ './pages/Index'),
  meta: {
    title: '用户管理',
    requiresAuth: true,
    scrollToTop: true
  }
}
