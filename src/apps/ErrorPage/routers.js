/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'ErrorPage/:num',
  name: 'platform.admin.ErrorPage',
  component: () => import(/* webpackChunkName: 'ErrorPage' */ './pages/Index'),
  meta: {
    title: 'ErrorPage',
    requiresAuth: true,
    scrollToTop: true
  }
}
