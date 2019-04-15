/**
 * Created by OXOYO on 2017/12/5.
 */

// 导入api
import Api from '../api'

export default {
  'list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getRoleList(payload)
    return res
  },
  // 资源完整列表
  'resource/list/all': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getAllResourceList(payload)
    return res
  },
  'add': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doAddRole(payload)
    return res
  },
  'edit': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doEditRole(payload)
    return res
  },
  'remove': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doRemoveRole(payload)
    return res
  }
}
