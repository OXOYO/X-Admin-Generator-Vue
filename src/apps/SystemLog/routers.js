/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'SystemLog',
  name: 'platform.admin.SystemLog',
  component: () => import(/* webpackChunkName: 'SystemLog' */ './pages/Index'),
  meta: {
    title: 'SystemLog',
    requiresAuth: true,
    scrollToTop: true
  }
}
