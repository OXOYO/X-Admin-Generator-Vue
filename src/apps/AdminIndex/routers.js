/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'adminindex',
  name: 'platform.admin.AdminIndex',
  component: () => import(/* webpackChunkName: 'AdminIndex' */ './pages/Index'),
  meta: {
    title: 'AdminIndex',
    requiresAuth: true,
    scrollToTop: true
  }
}
