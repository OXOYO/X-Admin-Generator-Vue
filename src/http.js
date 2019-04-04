/**
 * Created by yangfan9244 on 2019/4/4.
 *
 *
 */
import Vue from 'vue'
import axios from 'axios'
import * as Cookies from 'js-cookie'

// 创建 实例
const http = axios.create({
  baseURL: process.env.VUE_APP_API_BASE,
  withCredentials: true
})
// 设置 拦截器
http.interceptors.request.use((config) => {
  // loading 进度条启动
  Vue.prototype.$Loading.start()
  let tokenKey = Vue.prototype.$config.cookie.getItem('token')
  let tokenVal = Cookies.get(tokenKey) || ''
  // 设置请求头
  config.headers.common[tokenKey] = tokenVal

  return config
}, function (error) {
  return Promise.reject(error)
})
http.interceptors.response.use(function (response) {
  // loading 进度条关闭
  Vue.prototype.$Loading.finish()
  // 返回数据
  let resData = response && response.data ? response.data : response
  if (resData) {
    // 弹窗提示
    if (resData.code !== 200) {
      Vue.prototype.$Message.error(response.msg || resData.msg || '请求异常，请检查上送、返回。')
      if (resData.code === 9999) {
        // FIXME 清空Session Storeage
        sessionStorage.clear()
        let keysArr = Object.keys(Cookies.get())
        // FIXME 处理待排除的key
        let unless = []
        for (let i = 0, len = Vue.prototype.$config.cookie.unless.length; i < len; i++) {
          let key = Vue.prototype.$config.cookie.unless[i]
          let val = Vue.prototype.$config.cookie.getItem(key)
          unless.push(val)
        }
        for (let i = 0, len = keysArr.length; i < len; i++) {
          let key = keysArr[i]
          // 判断是否需要排除
          if (!unless.includes(key)) {
            Cookies.remove(key, {
              path: Vue.prototype.$config.cookie.path
            })
          }
        }
        // 跳转登录页
        if (Vue.prototype.$router) {
          Vue.prototype.$router.push({
            name: 'platform.home.signin'
          })
        }
      }
      return Promise.reject(new Error(response.msg || resData.msg || '请求异常，请检查上送、返回。')).catch(function (result) {
        console.log(result)
      })
    }
  } else {
    Vue.prototype.$Message.error('请求失败！')
    return Promise.reject(new Error('请求失败！')).catch(function (result) {
      console.log(result)
    })
  }
  return resData
}, function (error) {
  return Promise.reject(error)
})

export default http
