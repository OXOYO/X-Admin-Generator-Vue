/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'AdminIndex',
  name: 'platform.admin.AdminIndex',
  component: resolve => require(['./pages/Index'], resolve),
  meta: {
    title: 'AdminIndex',
    requiresAuth: true,
    scrollToTop: true
  }
}
