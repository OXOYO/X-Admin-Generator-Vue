/**
 * Created by OXOYO on 2017/12/5.
 */

import Vue from 'vue'
const $X = Vue.prototype.$X

export default {
  getLogList: async (data) => {
    let res = await $X.http.get('/SystemLog/list', {
      params: data
    })
    return res
  },
  // 获取全部角色列表
  getAllRoleList: async (data) => {
    let res = await $X.http.get('/RolesManagement/list/all', {
      params: data
    })
    return res
  }
}
