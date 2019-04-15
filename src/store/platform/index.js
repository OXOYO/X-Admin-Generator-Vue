/**
 * Created by OXOYO on 2019/4/4.
 *
 * 系统基础store
 */

import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  moduleName: 'Platform',
  store: {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
  }
}
