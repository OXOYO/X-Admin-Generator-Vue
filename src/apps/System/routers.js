/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'system',
  name: 'platform.admin.System',
  component: () => import(/* webpackChunkName: 'System' */ './pages/Index'),
  meta: {
    title: 'System',
    requiresAuth: true,
    scrollToTop: true
  }
}
