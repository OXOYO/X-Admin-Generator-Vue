/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'Settings',
  name: 'platform.admin.Settings',
  component: () => import(/* webpackChunkName: 'Settings' */ './pages/Index'),
  meta: {
    title: 'Settings',
    requiresAuth: true,
    scrollToTop: true
  }
}
