/**
 * Created by OXOYO on 2019/4/4.
 *
 * 全局组件
 */
import Copyright from './Copyright'
import Scrollbar from './Scrollbar'
import XPanel from './XPanel'
import XSwitch from './XSwitch'
import TagList from './TagList'
import HighLight from './HighLight.vue'
import NoData from './NoData.vue'

// 导入 element-ui
import { Table as ElTable, TableColumn as ElTableColumn } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

const obj = {
  Copyright,
  Scrollbar,
  XPanel,
  XSwitch,
  TagList,
  HighLight,
  NoData,
  ElTable,
  ElTableColumn
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
