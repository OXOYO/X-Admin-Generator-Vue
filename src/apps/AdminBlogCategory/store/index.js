/**
 * Created by OXOYO on 2019/4/29.
 */

import state from './state'
import actions from './actions'
import mutations from './mutations'

export default {
  moduleName: 'AdminBlogCategory',
  store: {
    namespaced: true,
    state,
    actions,
    mutations
  }
}
