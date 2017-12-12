/**
 * Created by OXOYO on 2017/12/5.
 */

import NoData from './NoData.vue'
import RainDay from './RainDay.vue'
import Wallpaper from './Wallpaper.vue'
import Copyright from './Copyright.vue'
import UPanel from './UPanel.vue'
import USwitch from './USwitch.vue'

export default {
  components: {
    NoData,
    RainDay,
    Wallpaper,
    Copyright,
    UPanel,
    USwitch
  },
  // 注册全局组件
  register: function (Vue) {
    let _t = this
    let components = _t.components
    for (let key in components) {
      if (key && components[key]) {
        Vue.component(key, components[key])
      }
    }
  }
}
