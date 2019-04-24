/**
 * Created by OXOYO on 2017/12/5.
 */

// 导入api
import Api from '../api'

export default {
  'Profile/edit': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.Profile.doEdit(payload)
    return res
  },
  'Account/edit': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.Account.doEdit(payload)
    return res
  }
}
