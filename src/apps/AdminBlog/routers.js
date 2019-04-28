/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'Blog',
  name: 'platform.admin.Blog',
  component: () => import(/* webpackChunkName: 'AdminBlog' */ './pages/Index'),
  meta: {
    title: 'AdminBlog',
    requiresAuth: true,
    scrollToTop: true
  }
}
