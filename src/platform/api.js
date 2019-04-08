/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */
import Vue from 'vue'

export default {
  user: {
    // 执行登录
    doSignIn: async (data) => {
      let res = await Vue.prototype.$X.http.post('/Platform/user/signIn', data)
      return res
    },
    // 获取用户基本信息
    getBaseInfo: async (data) => {
      let res = await Vue.prototype.$X.http.get('/Platform/user/BaseInfo')
      return res
    }
  },
  components: {
    // 获取bing壁纸
    getBingWallpaper: async (data) => {
      let res = await Vue.prototype.$X.http.get('/Platform/components/wallpaper/bing', {
        params: data
      })
      return res
    }
  },
  resource: {
    // 获取完整资源列表
    getAllResourceList: async (data) => {
      let res = await Vue.prototype.$X.http.get('/Platform/resource/list/all', {
        params: data
      })
      return res
    }
  }
}
