/**
 * Created by yangfan9244 on 2017/12/5.
 */

export default {
  path: 'DemoApp',
  name: 'platform.admin.DemoApp',
  component: resolve => require(['./pages/Index'], resolve),
  meta: {
    title: 'DemoApp',
    requiresAuth: true,
    scrollToTop: true
  }
}
