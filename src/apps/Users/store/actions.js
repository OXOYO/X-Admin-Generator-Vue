/**
 * Created by OXOYO on 2017/12/5.
 */

// 导入api
import Api from '../api'

export default {
  'list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getUserList(payload)
    return res
  },
  'list/all': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getAllUserList(payload)
    return res
  },
  // 角色完整列表
  'role/list/all': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getAllRoleList(payload)
    return res
  },
  'add': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doAddUser(payload)
    return res
  },
  'edit': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doEditUser(payload)
    return res
  },
  'remove': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doRemoveUser(payload)
    return res
  }
}
