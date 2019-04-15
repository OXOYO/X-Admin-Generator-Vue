/**
 * Created by OXOYO on 2017/12/5.
 */

// 导入api
import Api from '../api'

export default {
  'list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getLogList(payload)
    return res
  },
  // 角色完整列表
  'role/list/all': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getAllRoleList(payload)
    return res
  }
}
