/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */
import home from './home'

export default async function (Vue) {
  // 获取前台路由子节点
  let children = await Vue.prototype.$X.utils.routers.getRoutes(Vue.prototype.$X,'home',{
    parent_id: 0,
    position: ['home', 'home-nav'],
    enable: [1],
    type: ['module-system', 'module-app', 'module-link']
  })
  console.log('homeChildren', children, home)
  home.children = children
  return [
    // FIXME 此处只注册home路由
    home
  ]
}
