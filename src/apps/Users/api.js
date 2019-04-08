/**
 * Created by OXOYO on 2017/12/5.
 */

import Vue from 'vue'

export default {
  // 获取账号列表
  getUserList: async (data) => {
    let res = await Vue.prototype.$http.get('/Users/list', {
      params: data
    })
    return res
  },
  getAllUserList: async (data) => {
    let res = await Vue.prototype.$http.get('/Users/list/all', {
      params: data
    })
    return res
  },
  // 获取全部角色列表
  getAllRoleList: async (data) => {
    let res = await Vue.prototype.$http.get('/RolesManagement/list/all', {
      params: data
    })
    return res
  },
  // 添加账号
  doAddUser: async (data) => {
    let res = await Vue.prototype.$http.post('/Users/add', data)
    return res
  },
  // 删除账号
  doRemoveUser: async (data) => {
    let res = await Vue.prototype.$http.post('/Users/remove', data)
    return res
  },
  // 编辑账号
  doEditUser: async (data) => {
    let res = await Vue.prototype.$http.post('/Users/edit', data)
    return res
  }
}
