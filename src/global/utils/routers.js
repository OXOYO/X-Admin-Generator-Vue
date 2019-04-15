/**
 * Created by OXOYO on 2019/4/8.
 *
 * 路由相关工具
 */

export default {
  // 获取路由列表
  async getRoutes ($X, types, params) {
    // 分发action，调接口
    let res = await $X.storeInstance.dispatch('Platform/resource/list/all', params)
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
      $X.storeInstance.commit(`Platform/${targetType}/resourceMap/update`, resourceMap)
      let keys = Object.keys(resourceMap)
      let routerArr = []
      for (let j = 0, L2 = keys.length; j < L2; j++) {
        let key = keys[j]
        if (key.includes(targetType)) {
          handler(resourceMap[key], routerTree)
        }
      }
      routerMap[targetType] = routerArr
    }
    return routerTree
  }
}
