/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */
// import Vue from 'vue'
import axios from 'axios'

export default function (Vue) {
  // 创建 实例
  const http = axios.create({
    baseURL: process.env.VUE_APP_API_BASE,
    withCredentials: true
  })
// 设置 拦截器
  http.interceptors.request.use((config) => {
    // loading 进度条启动
    Vue.prototype.$Loading.start()
    const $X = Vue.prototype.$X
    let tokenKey = $X.config.cookie.getItem('token')
    let tokenVal = $X.Cookies.get(tokenKey) || ''
    // 设置请求头
    config.headers.common[tokenKey] = tokenVal
    // 设置请求地址
    let currentPath = config.url.split(config.baseURL)[0]
    config.headers.common['current-path'] = currentPath || ''
    // 设置route
    let routeNameKey = $X.config.cookie.getItem('currentRoute')
    let routeName = $X.Cookies.get(routeNameKey) || ''
    config.headers.common['current-name'] = routeName
    // 设置用户组
    let userGroupKey = $X.config.cookie.getItem('userGroup')
    let userGroupVal = $X.Cookies.get(userGroupKey) || ''
    config.headers.common['current-group'] = userGroupVal

    return config
  }, function (error) {
    return Promise.reject(error)
  })
  http.interceptors.response.use(function (response) {
    // loading 进度条关闭
    Vue.prototype.$Loading.finish()
    const $X = Vue.prototype.$X
    // 返回数据
    let resData = response && response.data ? response.data : response
    if (resData) {
      // 弹窗提示
      if (resData.code !== 200) {
        Vue.prototype.$Message.error(response.msg || resData.msg || Vue.prototype.$t('L00134'))
        if (resData.code === 9999) {
          // 清除存储的信息
          $X.utils.storage.clear(true)
          // 跳转登录页
          if (Vue.prototype.$router) {
            Vue.prototype.$router.push({
              name: 'platform.home.signin'
            })
          }
        }
        return Promise.reject(new Error(response.msg || resData.msg || Vue.prototype.$t('L00134'))).catch(function (result) {
          console.log(result)
        })
      }
    } else {
      Vue.prototype.$Message.error(Vue.prototype.$t('L00135'))
      return Promise.reject(new Error(Vue.prototype.$t('L00135'))).catch(function (result) {
        console.log(result)
      })
    }
    return resData
  }, function (error) {
    return Promise.reject(error)
  })
  return http
}
