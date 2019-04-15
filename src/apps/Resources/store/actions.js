/**
 * Created by OXOYO on 2017/12/5.
 */

// 导入api
import Api from '../api'

export default {
  'list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getResourceList(payload)
    return res
  },
  'list/all': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getAllResourceList(payload)
    return res
  },
  'add': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doAddResource(payload)
    return res
  },
  'edit': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doEditResource(payload)
    return res
  },
  'sort': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doSortResource(payload)
    return res
  },
  'remove': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doRemoveResource(payload)
    return res
  }
}
