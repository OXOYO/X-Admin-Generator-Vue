/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'TODO',
  name: 'platform.admin.TODO',
  component: () => import(/* webpackChunkName: 'TODO' */ './pages/Index'),
  meta: {
    title: 'TODO',
    requiresAuth: true,
    scrollToTop: true
  }
}
