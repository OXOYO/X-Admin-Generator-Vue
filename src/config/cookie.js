/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */

export default {
  prefix: 'x-admin-',
  path: '/',
  items: {
    account: 'a',
    token: 't',
    locale: 'l',
    background: 'b'
  },
  // 退出时无需清除的cookie key
  unless: [],
  getItem (key) {
    return key ? this.prefix + this.items[key] : ''
  }
}
