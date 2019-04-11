/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'ErrorPage/:num',
  name: 'platform.admin.ErrorPage',
  component: resolve => require(['./pages/Index'], resolve),
  meta: {
    title: 'ErrorPage',
    requiresAuth: true,
    scrollToTop: true
  }
}
