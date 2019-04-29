/**
 * Created by OXOYO on 2019/4/29.
 */

export default {
  path: 'category',
  name: 'platform.admin.AdminBlogCategory',
  component: () => import(/* webpackChunkName: 'AdminBlog' */ './pages/Index'),
  meta: {
    title: 'AdminBlogCategory',
    requiresAuth: true,
    scrollToTop: true
  }
}
