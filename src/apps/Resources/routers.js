/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'resources',
  name: 'platform.admin.Resources',
  component: () => import(/* webpackChunkName: 'Resources' */ './pages/Index'),
  meta: {
    title: 'Resources',
    requiresAuth: true,
    scrollToTop: true
  }
}
