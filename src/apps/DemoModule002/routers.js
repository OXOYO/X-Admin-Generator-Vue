/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'DemoModule002',
  name: 'platform.admin.DemoModule002',
  component: resolve => require(['./pages/Index'], resolve),
  meta: {
    title: 'DemoModule002',
    requiresAuth: true,
    scrollToTop: true
  }
}
