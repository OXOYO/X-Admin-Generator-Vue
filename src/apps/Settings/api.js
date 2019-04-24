/**
 * Created by OXOYO on 2017/12/5.
 */

import Vue from 'vue'
const $X = Vue.prototype.$X

export default {
  Profile: {
    // 编辑账号
    doEdit: async (data) => {
      let res = await $X.http.post('/Settings/Profile/edit', data)
      return res
    }
  },
  Account: {
    // 编辑账号
    doEdit: async (data) => {
      let res = await $X.http.post('/Settings/Account/edit', data)
      return res
    }
  }
}
