/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'Blog',
  name: 'platform.home.Blog',
  component: () => import(/* webpackChunkName: 'HomeBlog' */ './pages/Index'),
  meta: {
    title: 'HomeBlog',
    requiresAuth: false,
    scrollToTop: true
  }
}
