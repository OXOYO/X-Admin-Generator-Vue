/**
 * Created by OXOYO on 2019/4/8.
 *
 * 路由相关工具
 */

import admin from '../../router/admin'

export default {
  // 获取路由列表
  async getRoutes ($X, types, params) {
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
    if (!Array.isArray(types)) {
      types = [types]
    }
    let routerMap = {}
    let handler = function (arr, parent) {
      for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i]
        if (item.parent_id === parent.id) {
          let moduleName = item.dir
          if (!Array.isArray(parent.children)) {
            parent.children = []
          }
          let moduleRouters
          try {
            // 加载路由
            moduleRouters = require('@/apps/' + moduleName + '/routers.js')
          } catch (e) {
            console.warn(e)
          }
          if (moduleRouters) {
            // 处理子节点路由
            moduleRouters = handler(arr, {
              id: item.id,
              parent_id: item.parent_id,
              ...moduleRouters.default
            })
            parent.children.push(moduleRouters)
          }
        }
      }
      return parent
    }
    let routerTree = {
      id: 0,
      children: []
    }
    for (let i = 0, L1 = types.length; i < L1; i++) {
      let targetType = types[i]
      // 存储数据
      // let key = $X.config.cookie.getItem('resourceMap') + '-' + targetType
      // sessionStorage.setItem(key, JSON.stringify(resourceMap))
      // 分发mutation，更新resourceMap
      $X.storeInstance.commit(`platform/${targetType}/resourceMap/update`, resourceMap)
      let keys = Object.keys(resourceMap)
      let routerArr = []
      for (let j = 0, L2 = keys.length; j < L2; j++) {
        let key = keys[j]
        if (key.includes(targetType)) {
          handler(resourceMap[key], routerTree)
          /*
          let dirArr = []
          for (let k = 0, L3 = resourceMap[key].length; k < L3; k++) {
            let item = resourceMap[key][k]
            // FIXME 此处需考虑递归遍历
            if (item.parent_id === 0) {
              dirArr.push(item.dir)
              // TODO 查找子节点
            }
          }
          console.log('dirArr', dirArr)
          for (let k = 0, L3 = dirArr.length; k < L3; k++) {
            let moduleName = dirArr[k]
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
          */
        }
      }
      console.log('routerTree', routerTree)
      routerMap[targetType] = routerArr
    }
    // return routerMap
    return routerTree
  },
  // 注册后台路由
  async addAdminRoute (_t, parent) {
    let that = this
    // 获取后台路由
    let children = await that.getRoutes(_t.$X, 'admin', {
      parent_id: 0,
      position: ['admin', 'admin-nav', 'admin-sidebar'],
      enable: [1],
      type: ['module-system', 'module-app', 'module-link']
    })
    // 处理children路由
    for (let i = 0, len = children.length; i < len; i++) {
      let item = children[i]
      if (!admin.children.find(target => target.name === item.name)) {
        admin.children.push(item)
      }
    }
    console.log('children', children)
    console.log('adminChildren', admin.children)
    // 只取一级路由
    // admin.children = children.filter(item => item.parent_id === 0)
    let routes = _t.$router.options.routes
    console.log('routes', children, routes)
    // 判断是否已存在admin路由
    if (!routes.find(item => item.name === admin.name)) {
      console.log('xxxxxxxxxx')
      _t.$router.addRoutes([admin])
      // $router不是响应式的，所以手动将路由元注入路由对象
      _t.$router.options.routes.push(admin)
      console.log('_t.$router.options.routes', _t.$router.options.routes)
    }
  },
  // 注册前台路由
  async addHomeRoute (_t, parent) {
    let that = this
    // 获取后台路由
    let children = await that.getRoutes(_t.$X, 'home', {
      parent_id: 0,
      position: ['home', 'home-nav'],
      enable: [1],
      type: ['module-system', 'module-app', 'module-link']
    })
    // 处理children路由
    for (let i = 0, len = children.length; i < len; i++) {
      let item = children[i]
      if (!admin.children.find(target => target.name === item.name)) {
        admin.children.push(item)
      }
    }
    console.log('children', children)
    console.log('adminChildren', admin.children)
    // 只取一级路由
    // admin.children = children.filter(item => item.parent_id === 0)
    let routes = _t.$router.options.routes
    console.log('routes', children, routes)
    // 判断是否已存在admin路由
    if (!routes.find(item => item.name === admin.name)) {
      console.log('xxxxxxxxxx')
      _t.$router.addRoutes([admin])
      // $router不是响应式的，所以手动将路由元注入路由对象
      _t.$router.options.routes.push(admin)
      console.log('_t.$router.options.routes', _t.$router.options.routes)
    }
  }
}
