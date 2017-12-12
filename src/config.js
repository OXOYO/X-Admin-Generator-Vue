/**
 * Created by OXOYO on 2017/12/5.
 */

// 服务配置
export const Serv = {
  development: '//localhost:3000/api',
  production: '//localhost:3000/api'
}

// cookie相关配置
export const Cookie = {
  prefix: 'x-admin-',
  keys: {
    account: 'account',
    token: 'key',
    userType: 'user-type',
    userCode: 'user-code'
  },
  getItem: function (key) {
    return key ? this.prefix + this.keys[key] : ''
  }
}

// 系统配置
export const System = {
  version: '1.0.1',
  name: 'X-Admin-Generator-Vue',
  title: 'X-Admin-Generator-Vue',
  subtitle: 'X-Admin-Generator-Vue',
  logo: '/static/logo.png',
  copyright: '© 2017'
}
