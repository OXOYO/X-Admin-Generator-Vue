/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'DemoApp',
  name: 'platform.admin.DemoApp',
  component: () => import(/* webpackChunkName: 'DemoApp' */ './pages/Index'),
  meta: {
    title: 'DemoApp',
    requiresAuth: true,
    scrollToTop: true
  }
}
