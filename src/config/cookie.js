/**
 * Created by yangfan9244 on 2019/4/4.
 *
 *
 */

export default {
  prefix: 'x-admin-',
  path: '/x-admin',
  items: {
    account: 'account',
    token: 't'
  },
  // 退出时无需清除的cookie key
  unless: [],
  getItem: function (key) {
    return key ? this.prefix + this.items[key] : ''
  }
}
