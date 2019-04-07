/**
 * Created by OXOYO on 2019/4/4.
 *
 * 项目store
 */
import Vuex from 'vuex'

import apps from './apps'
import platform from './platform'

export default function (Vue) {
  // 注册vuex
  Vue.use(Vuex)
  // 返回Store实例
  return new Vuex.Store({
    modules: {
      [platform.moduleName]: platform.store,
      [apps.moduleName]: apps.store
    }
  })
}
