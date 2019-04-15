/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'Roles',
  name: 'platform.admin.Roles',
  component: resolve => require(['./pages/Index'], resolve),
  meta: {
    title: '角色管理',
    requiresAuth: true,
    scrollToTop: true
  }
}
