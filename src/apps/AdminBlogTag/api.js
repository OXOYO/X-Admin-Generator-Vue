/**
 * Created by OXOYO on 2019/4/29.
 */

import Vue from 'vue'
const $X = Vue.prototype.$X

export default {
  getList: async (data) => {
    let res = await $X.http.get('/AdminBlogTag/list', {
      params: data
    })
    return res
  },
  doAdd: async (data) => {
    let res = await $X.http.post('/AdminBlogTag/add', data)
    return res
  },
  doRemove: async (data) => {
    let res = await $X.http.post('/AdminBlogTag/remove', data)
    return res
  },
  doEdit: async (data) => {
    let res = await $X.http.post('/AdminBlogTag/edit', data)
    return res
  }
}
