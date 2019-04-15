/**
 * Created by OXOYO on 2017/12/5.
 */

import Vue from 'vue'
const $X = Vue.prototype.$X

export default {
  // 获取资源列表
  getResourceList: async (data) => {
    let res = await $X.http.get('/Resources/list', {
      params: data
    })
    return res
  },
  getAllResourceList: async (data) => {
    let res = await $X.http.get('/Resources/list/all', {
      params: data
    })
    return res
  },
  // 添加资源
  doAddResource: async (data) => {
    let res = await $X.http.post('/Resources/add', data)
    return res
  },
  // 编辑资源
  doEditResource: async (data) => {
    let res = await $X.http.post('/Resources/edit', data)
    return res
  },
  doSortResource: async (data) => {
    let res = await $X.http.post('/Resources/sort', data)
    return res
  },
  // 删除资源
  doRemoveResource: async (data) => {
    let res = await $X.http.post('/Resources/remove', data)
    return res
  }
}
