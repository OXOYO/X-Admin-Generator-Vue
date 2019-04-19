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
      title: '超级管理员',
      icon: 'ios-people'
    },
    {
      type: 1,
      title: '管理员',
      icon: 'ios-person'
    },
    {
      type: 2,
      title: '普通用户',
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
