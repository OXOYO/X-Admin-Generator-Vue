/**
 * Created by OXOYO on 2017/12/5.
 */

// 导入api
import Api from '../api'

export default {
  'task/list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.Task.getList(payload)
    return res
  },
  'task/add': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.Task.doAdd(payload)
    return res
  },
  'task/edit': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.Task.doEdit(payload)
    return res
  },
  'task/remove': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.Task.doRemove(payload)
    return res
  },
  'category/list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.Category.getList(payload)
    return res
  },
  'category/add': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.Category.doAdd(payload)
    return res
  },
  'category/edit': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.Category.doEdit(payload)
    return res
  },
  'category/remove': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.Category.doRemove(payload)
    return res
  }
}
