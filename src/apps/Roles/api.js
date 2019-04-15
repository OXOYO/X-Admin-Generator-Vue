/**
 * Created by OXOYO on 2017/12/5.
 */

import Vue from 'vue'
const $X = Vue.prototype.$X

export default {
  // 获取角色列表
  getRoleList: async (data) => {
    let res = await $X.http.get('/Roles/list', {
      params: data
    })
    return res
  },
  // 获取完整资源列表
  getAllResourceList: async (data) => {
    let res = await $X.http.get('/Resources/list/all', {
      params: data
    })
    return res
  },
  // 添加角色
  doAddRole: async (data) => {
    let res = await $X.http.post('/Roles/add', data)
    return res
  },
  // 删除角色
  doRemoveRole: async (data) => {
    let res = await $X.http.post('/Roles/remove', data)
    return res
  },
  // 编辑角色
  doEditRole: async (data) => {
    let res = await $X.http.post('/Roles/edit', data)
    return res
  }
}
