/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'DemoModule001',
  name: 'platform.admin.DemoModule001',
  component: resolve => require(['./pages/Index'], resolve),
  meta: {
    title: 'DemoModule001',
    requiresAuth: true,
    scrollToTop: true
  }
}
