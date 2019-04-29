/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'blog',
  name: 'platform.admin.Blog',
  component: () => import(/* webpackChunkName: 'AdminBlog' */ './pages/Index'),
  meta: {
    title: 'AdminBlog',
    requiresAuth: true,
    scrollToTop: true
  }
  /*
  ,
  children: [
    {
      path: 'category',
      name: 'platform.admin.Blog.Category',
      component: () => import(/!* webpackChunkName: 'AdminBlog' *!/ './pages/CategoryPage'),
      meta: {
        title: 'AdminBlogCategory',
        requiresAuth: true,
        scrollToTop: true
      }
    },
    {
      path: 'tag',
      name: 'platform.admin.Blog.Tag',
      component: () => import(/!* webpackChunkName: 'AdminBlog' *!/ './pages/TagPage'),
      meta: {
        title: 'AdminBlogTag',
        requiresAuth: true,
        scrollToTop: true
      }
    }
  ]
  */
}
