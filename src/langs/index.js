/**
 * Created by OXOYO on 2019/4/6.
 *
 */
// 导入iview语言包
import _en from 'iview/dist/locale/en-US'
import _zh from 'iview/dist/locale/zh-CN'

// 导入系统语言包
import zh from './zh-CN'
import en from './en-US'

export default {
  label: {
    zh: '简体中文',
    en: 'English'
  },
  data: {
    zh: { ..._zh, ...zh },
    en: { ..._en, ...en }
  }
}
