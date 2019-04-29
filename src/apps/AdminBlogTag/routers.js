/**
 * Created by OXOYO on 2019/4/29.
 */

export default {
  path: 'tag',
  name: 'platform.admin.AdminBlogTag',
  component: () => import(/* webpackChunkName: 'AdminBlog' */ './pages/Index'),
  meta: {
    title: 'AdminBlogTag',
    requiresAuth: true,
    scrollToTop: true
  }
}
