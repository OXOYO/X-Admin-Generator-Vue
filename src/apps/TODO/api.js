/**
 * Created by OXOYO on 2017/12/5.
 */

import Vue from 'vue'
const $X = Vue.prototype.$X

export default {
  Task: {
    getList: async (data) => {
      let res = await $X.http.get('/TODO/task/list', {
        params: data
      })
      return res
    },
    doAdd: async (data) => {
      let res = await $X.http.post('/TODO/task/add', data)
      return res
    },
    doRemove: async (data) => {
      let res = await $X.http.post('/TODO/task/remove', data)
      return res
    },
    doEdit: async (data) => {
      let res = await $X.http.post('/TODO/task/edit', data)
      return res
    }
  },
  Category: {
    getList: async (data) => {
      let res = await $X.http.get('/TODO/category/list', {
        params: data
      })
      return res
    },
    doAdd: async (data) => {
      let res = await $X.http.post('/TODO/category/add', data)
      return res
    },
    doRemove: async (data) => {
      let res = await $X.http.post('/TODO/category/remove', data)
      return res
    },
    doEdit: async (data) => {
      let res = await $X.http.post('/TODO/category/edit', data)
      return res
    }
  }
}
