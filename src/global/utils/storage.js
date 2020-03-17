/**
 * Created by OXOYO on 2019/4/11.
 *
 * storage 管理
 */

export default {
  // 清除存储的信息
  clear (clearAll = false) {
    let _t = this
    // FIXME 清空Session Storage
    sessionStorage.clear()
    // 清空cookie
    let keysArr = Object.keys(_t.$X.Cookies.get())
    // FIXME 处理待排除的key
    let unless = []
    // 判断是否全部清除
    if (!clearAll) {
      for (let i = 0, len = _t.$X.config.cookie.unless.length; i < len; i++) {
        let key = _t.$X.config.cookie.unless[i]
        let val = _t.$X.config.cookie.getItem(key)
        unless.push(val)
      }
    }
    for (let i = 0, len = keysArr.length; i < len; i++) {
      let key = keysArr[i]
      // 判断是否需要排除
      if (!unless.includes(key)) {
        _t.$X.Cookies.remove(key, { path: _t.$X.config.cookie.path })
      }
    }
  }
}
