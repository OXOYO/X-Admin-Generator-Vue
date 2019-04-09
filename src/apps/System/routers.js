/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'System',
  name: 'platform.admin.System',
  component: resolve => require(['./pages/Index'], resolve),
  meta: {
    title: 'System',
    requiresAuth: true,
    scrollToTop: true
  }
}
