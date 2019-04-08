/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'Users',
  name: 'platform.admin.Users',
  component: resolve => require(['./pages/Index'], resolve),
  meta: {
    title: '用户管理',
    requiresAuth: true,
    scrollToTop: true
  }
}
