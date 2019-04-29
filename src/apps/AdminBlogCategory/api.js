/**
 * Created by OXOYO on 2019/4/29.
 */

import Vue from 'vue'
const $X = Vue.prototype.$X

export default {
  getList: async (data) => {
    let res = await $X.http.get('/AdminBlogCategory/list', {
      params: data
    })
    return res
  },
  doAdd: async (data) => {
    let res = await $X.http.post('/AdminBlogCategory/add', data)
    return res
  },
  doRemove: async (data) => {
    let res = await $X.http.post('/AdminBlogCategory/remove', data)
    return res
  },
  doEdit: async (data) => {
    let res = await $X.http.post('/AdminBlogCategory/edit', data)
    return res
  }
}
