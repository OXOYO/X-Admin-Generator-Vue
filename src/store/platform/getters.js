/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */

export default {
  userInfo: state => state.userInfo,
  userClass: state => state.userClass,
  // TODO 权限验证功能待实现
  verifyPermission: (state) => {
    return () => {
      return true

    }
  }
}
