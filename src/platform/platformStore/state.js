/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  userInfo: {},
  // layout
  layout: {
    // 左右布局大小
    spanSize: {
      left: 3,
      right: 21
    },
    // 面包屑信息
    breadcrumb: [],
    // 菜单
    menus: {
      // 当前激活菜单
      activeName: 'platform.admin.DemoModule001',
      // FIXME 菜单项列表，可以存入数据库做成动态配置的
      list: [
        {
          id: 100,
          index: 100,
          name: 'platform.admin.Index',
          icon: 'home',
          title: '后台首页',
          // 是否启用
          enable: true,
          // 是否在侧边栏显示
          sidebar: false,
          // 允许访问的用户类别 0 管理员 1 普通用户
          userType: [0, 1]
        },
        {
          id: 200,
          index: 200,
          name: 'platform.admin.Users',
          icon: 'person-stalker',
          title: '用户管理',
          // 是否启用
          enable: true,
          // 是否在侧边栏显示
          sidebar: true,
          // 允许访问的用户类别 0 管理员 1 普通用户
          userType: [0]
        },
        {
          id: 300,
          index: 300,
          name: 'platform.admin.DemoModule001',
          icon: 'arrow-graph-up-right',
          title: 'DemoModule001',
          enable: true,
          sidebar: true,
          userType: [1]
        },
        {
          id: 400,
          index: 400,
          name: 'platform.admin.DemoModule002',
          icon: 'arrow-graph-up-right',
          title: 'DemoModule002',
          enable: true,
          sidebar: true,
          userType: [0, 1],
          children: [
            // FIXME 【TEST】测试用数据
            {
              id: 401,
              index: 401,
              name: 'admin.DemoModule002.test',
              title: 'DemoModule002.test',
              enable: true,
              sidebar: false,
              userType: [0]
            }
          ]
        }
      ]
    }
  }
}
