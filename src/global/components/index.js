/**
 * Created by OXOYO on 2019/4/4.
 *
 * 全局组件
 */
import Copyright from './Copyright'
import Wallpaper from './Wallpaper'
import Scrollbar from './Scrollbar'
import XPanel from './XPanel'
import XSwitch from './XSwitch'

const obj = {
  Copyright,
  Wallpaper,
  Scrollbar,
  XPanel,
  XSwitch
}

const components = {}
components.install = function (Vue, options) {
  for (let name in obj) {
    if (name && obj[name]) {
      Vue.component(name, obj[name])
    }
  }
}

export default components
