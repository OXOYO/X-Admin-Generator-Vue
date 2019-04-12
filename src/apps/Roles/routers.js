/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'Roles',
  name: 'platform.admin.Roles',
  component: () => import(/* webpackChunkName: 'Roles' */ './pages/Index'),
  meta: {
    title: 'Roles',
    requiresAuth: true,
    scrollToTop: true
  }
}
