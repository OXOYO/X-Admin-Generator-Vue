/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'systemlog',
  name: 'platform.admin.SystemLog',
  component: resolve => require(['./pages/Index'], resolve),
  meta: {
    title: 'SystemLog',
    requiresAuth: true,
    scrollToTop: true
  }
}
