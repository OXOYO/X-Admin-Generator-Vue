/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  path: 'framepage/:name',
  name: 'platform.admin.FramePage',
  component: () => import(/* webpackChunkName: 'FramePage' */ './pages/Index'),
  meta: {
    title: 'FramePage',
    requiresAuth: true,
    scrollToTop: true
  }
}
