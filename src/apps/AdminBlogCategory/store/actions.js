/**
 * Created by OXOYO on 2019/4/29.
 */

// 导入api
import Api from '../api'

export default {
  'list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getList(payload)
    return res
  },
  'add': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doAdd(payload)
    return res
  },
  'edit': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doEdit(payload)
    return res
  },
  'remove': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doRemove(payload)
    return res
  }
}
