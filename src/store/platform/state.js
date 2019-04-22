/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */

export default {
  background: {
    name: '',
    source: null
  },
  userInfo: {},
  userResources: [],
  // 用户分类信息
  userClass: [
    {
      type: 0,
      enable: true,
      title: '超级管理员',
      lang: 'L00127',
      icon: 'ios-people'
    },
    {
      type: 1,
      enable: true,
      title: '管理员',
      lang: 'L00126',
      icon: 'ios-person'
    },
    {
      type: 2,
      enable: true,
      title: '普通用户',
      lang: 'L00125',
      icon: 'ios-person-outline'
    }
  ],
  home: {
    resourceMap: {}
  },
  admin: {
    resourceMap: {},
    activeMenuName: ''
  },
  // 鉴权排除项
  unless: {
    verifyPermission: {
      router: []
    },
    verifyAccess: {
      router: [
        'platform.admin.AdminIndex',
        'platform.admin.FramePage',
        'platform.admin.ErrorPage'
      ]
    }
  }
}
