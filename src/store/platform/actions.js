/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */
import api from '../../platform/api'

export default {
  'user/signIn': async ({ commit }, payload) => {
    // 调接口
    let res = await api.user.doSignIn(payload)
    return res
  },
  'user/BaseInfo': async ({ commit }, payload) => {
    let res = await api.user.getBaseInfo(payload)
    return res
  },
  // 获取bing壁纸
  'components/wallpaper/bing': async ({ commit }, payload) => {
    let res = await api.components.getBingWallpaper(payload)
    return res
  },
  // 获取资源列表
  'resource/list/all': async ({ commit }, payload) => {
    // 调接口
    let res = await api.resource.getAllResourceList(payload)
    return res
  }
}
