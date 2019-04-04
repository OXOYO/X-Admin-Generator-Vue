/**
 * Created by yangfan9244 on 2019/4/4.
 *
 *
 */
import Vue from 'vue'

export default {
  components: {
    // 获取bing壁纸
    getBingWallpaper: async (data) => {
      let res = await Vue.prototype.$http.get('/Platform/components/wallpaper/bing', {
        params: data
      })
      return res
    }
  }
}
