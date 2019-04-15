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
    background: 'b',
    admin_sidebar_isCollapsed: 'c',
    userGroup: 'ug',
    resourceMap: 'r',
    currentRoute: 'cr'
  },
  // 退出时无需清除的cookie key
  unless: ['locale', 'background', 'admin_sidebar_isCollapsed'],
  getItem (key) {
    return key ? this.prefix + this.items[key] : ''
  }
}
