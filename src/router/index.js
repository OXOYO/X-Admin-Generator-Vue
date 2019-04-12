/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */
import home from './home'
import admin from './admin'

// FIXME !!! 可以考虑在此处一次性注册全部路由，访问时通过鉴权逻辑控制
export default async function (Vue) {
  /*
  // 方式一 前后台分别独立加载
  // 获取前台路由子节点
  let children = await Vue.prototype.$X.utils.routers.getRoutes(Vue.prototype.$X,'home',{
    parent_id: 0,
    // 加载所有位置的路由
    // position: ['home', 'home-nav', 'admin', 'admin-nav', 'admin-sidebar'],
    enable: [1],
    type: ['module-system', 'module-app', 'module-link']
  })
  console.log('homeChildren', children, home)
  home.children = children
  return [
    // FIXME 此处只注册home路由
    home
  ]
  */
  /*
  // 方式二 统一加载routerMap
  let routerMap = await Vue.prototype.$X.utils.routers.getRoutes(Vue.prototype.$X, ['home', 'admin'], {
    // parent_id: 0,
    // 加载所有位置的路由
    position: ['home', 'home-nav', 'admin', 'admin-nav', 'admin-sidebar'],
    enable: [1],
    type: ['module-system', 'module-app', 'module-link']
  })
  console.log('000000000000', routerMap)
  home.children = routerMap.home
  admin.children = routerMap.admin

  return [
    home,
    admin
  ]
  */
  // 方式三 统一加载 routerTree
  let routerTree = await Vue.prototype.$X.utils.routers.getRoutes(Vue.prototype.$X, ['home', 'admin'], {
    // parent_id: 0,
    // 加载所有位置的路由
    position: ['home', 'home-nav', 'admin', 'admin-nav', 'admin-sidebar'],
    enable: [1],
    type: ['module-system', 'module-app', 'module-link']
  })
  console.log('000000000000', routerTree)
  home.children = routerTree.children.filter(item => item.name.includes(home.name))
  admin.children = routerTree.children.filter(item => item.name.includes(admin.name))

  return [
    home,
    admin
  ]
}
