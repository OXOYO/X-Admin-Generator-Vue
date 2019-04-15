/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */
import home from './home'
import admin from './admin'

// FIXME !!! 可以考虑在此处一次性注册全部路由，访问时通过鉴权逻辑控制
export default async function (Vue) {
  // 方式三 统一加载 routerTree
  let routerTree = await Vue.prototype.$X.utils.routers.getRoutes(Vue.prototype.$X, ['home', 'admin'], {
    // parent_id: 0,
    // 加载所有位置的路由
    position: ['home', 'home-nav', 'admin', 'admin-nav', 'admin-sidebar'],
    enable: [1],
    type: ['module-system', 'module-app', 'module-link']
  })
  home.children = routerTree.children.filter(item => item.name.includes(home.name))
  admin.children = routerTree.children.filter(item => item.name.includes(admin.name))

  return [
    home,
    admin
  ]
}
