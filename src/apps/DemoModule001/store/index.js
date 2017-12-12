/**
 * Created by OXOYO on 2017/12/5.
 */

import state from './state'
import actions from './actions'
import mutations from './mutations'

export default {
  moduleName: 'demoModule001',
  store: {
    namespaced: true,
    state,
    actions,
    mutations
  }
}
