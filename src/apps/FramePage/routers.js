/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'FramePage/:name',
  name: 'platform.admin.FramePage',
  component: resolve => require(['./pages/Index'], resolve),
  meta: {
    title: 'FramePage',
    requiresAuth: true,
    scrollToTop: true
  }
}
