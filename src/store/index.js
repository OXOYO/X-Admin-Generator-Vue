/**
 * Created by yangfan9244 on 2019/4/4.
 *
 * 项目store
 */
import Vue from 'vue'
import Vuex from 'vuex'

import apps from './apps'
import platform from './platform'

// 注册vuex
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    [platform.moduleName]: platform.store,
    [apps.moduleName]: apps.store
  }
})
