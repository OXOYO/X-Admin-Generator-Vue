/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'SigIn',
  name: 'platform.home.SigIn',
  component: resolve => require(['./pages/Index'], resolve),
  meta: {
    title: 'SigIn',
    requiresAuth: true,
    scrollToTop: true
  }
}
