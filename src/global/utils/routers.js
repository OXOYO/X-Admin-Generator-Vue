/**
 * Created by OXOYO on 2019/4/8.
 *
 * 路由相关工具
 */

import admin from '../../router/admin'

export default {
  // 获取路由列表
  async getRoutes ($X, targetType, params) {
    // 分发action，调接口
    let res = await $X.storeInstance.dispatch('platform/resource/list/all', params)
    if (!res || res.code !== 200) {
      return []
    }
    // 处理返回数据
    let resourceList = []
    if (res.data.count && res.data.list && res.data.list.length) {
      resourceList = res.data.list || []
    }
    // 处理资源
    let resourceMap = {}
    if (resourceList.length) {
      // FIXME 挂载位置：home 前台隐式 home-nav 前台导航 admin 后台隐式 admin-nav 后台导航 admin-sidebar 后台侧边栏
      for (let i = 0, len = resourceList.length; i < len; i++) {
        let item = resourceList[i]
        if (!resourceMap.hasOwnProperty(item.position)) {
          resourceMap[item.position] = []
        }
        resourceMap[item.position].push(item)
      }
    }
    // 处理路由
    console.log('resourceMap', resourceMap)
    // 分发mutation，更新resourceMap
    $X.storeInstance.commit(`platform/${targetType}/resourceMap/update`, resourceMap)
    let keys = Object.keys(resourceMap)
    let moduleArr = []
    let routerArr = []
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      if (key.includes(targetType)) {
        let tmpArr = resourceMap[key]
        moduleArr = tmpArr.map(item => item.dir)
        console.log('moduleArr', moduleArr)
        for (let i = 0, len = moduleArr.length; i < len; i++) {
          let moduleName = moduleArr[i]
          try {
            // 加载路由
            let moduleRouters = require('@/apps/' + moduleName + '/routers.js')
            if (moduleRouters) {
              routerArr.push(moduleRouters.default)
            }
          } catch (e) {
            console.warn(e)
          }
        }
      }
    }
    return routerArr
  },
  async addRoutes (_t, moduleArr) {
    let children = []
    for (let i = 0, len = moduleArr.length; i < len; i++) {
      let moduleName = moduleArr[i]
      try {
        // 加载路由
        let moduleRouters = require('@/apps/' + moduleName + '/routers.js')
        if (moduleRouters) {
          children.push(moduleRouters.default)
        }
      } catch (e) {
        console.warn(e)
      }
    }
    console.log('addRoutes children', children, _t.$router.options.routes)
    // 已有路由
    let routes = [..._t.$router.options.routes]
    // 遍历待添加的路由
    for (let i = 0, L1 = routes.length; i < L1; i++) {
      let routeItem = routes[i]
      for (let j = 0, L2 = children.length; j < L2; j++) {
        let childItem = children[j]
        if (routeItem.name + '.' + childItem.dir === childItem.name) {
          // 判断是否已存在同名路由
          let flag = false
          if (routeItem.children && routeItem.children.length) {
            flag = !!routeItem.children.find(target => target.name === childItem.name)
          }
          if (!flag) {
            routeItem.children.push(childItem)
          }
        }
      }
      routes[i] = routeItem
    }
    _t.$router.addRoutes(routes)
    console.log('routes', routes, _t.$router.options.routes)
    // 防止重复配置相同路由
    // if (_t.$router.options.routes.length <= 1) {
    //   _t.$router.addRoutes(children)
    //   // $router不是响应式的，所以手动将路由元注入路由对象
    //   _t.$router.options.routes.push(children)
    // }
  },
  // 注册后台路由
  async addAdminRoute (_t) {
    let that = this
    // 获取后台路由
    let children = await that.getRoutes(_t.$X, 'admin', {
      parent_id: 0,
      position: ['admin', 'admin-nav', 'admin-sidebar'],
      enable: [1],
      type: ['module-system', 'module-app', 'module-link']
    })
    console.log('adminChildren', children)
    admin.children = children
    let routes = _t.$router.options.routes
    console.log('routes', children, routes)
    // 判断算法已存在admin路由
    if (!routes.find(item => item.name === admin.name)) {
      console.log('xxxxxxxxxx')
      _t.$router.addRoutes([admin])
      // $router不是响应式的，所以手动将路由元注入路由对象
      _t.$router.options.routes.push(admin)
    }
  }
}
