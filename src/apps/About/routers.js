/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'About',
  name: 'platform.home.About',
  component: () => import(/* webpackChunkName: 'Users' */ './pages/Index'),
  meta: {
    title: 'About',
    requiresAuth: true,
    scrollToTop: true
  }
}
