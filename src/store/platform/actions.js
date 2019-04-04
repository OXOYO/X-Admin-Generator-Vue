/**
 * Created by yangfan9244 on 2019/4/4.
 *
 *
 */
import api from '../../platform/api'

export default {
  // 获取bing壁纸
  'components/wallpaper/bing': async ({ commit }, payload) => {
    let res = await api.components.getBingWallpaper(payload)
    return res
  }
}
