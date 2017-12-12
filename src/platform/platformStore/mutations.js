/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  'userInfo/update': (state, data) => {
    state.userInfo = {
      ...data
    }
  },
  'userInfo/reset': (state, data) => {
    state.userInfo = data
  },
  // 切换Sidebar显示控制
  'layout/spanSize/update': (state, data) => {
    state.layout.spanSize = data
  },
  'layout/menus/activeName/update': (state, data) => {
    state.layout.menus.activeName = data
  }
}
