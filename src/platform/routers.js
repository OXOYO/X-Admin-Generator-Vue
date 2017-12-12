/**
 * Created by OXOYO on 2017/12/5.
 */

// FIXME 动态加载路由
import state from './platformStore/state'

const menuList = state.layout.menus.list
const adminChildren = []
// 解析menuList
for (let i = 0, len = menuList.length, item, moduleName, module, moduelRouters; i < len; i++) {
  item = menuList[i]
  moduleName = item.name.split('.')[2]
  try {
    // 加载路由
    module = require('../apps/' + moduleName + '/routers.js')
    moduelRouters = module.default
    adminChildren.push(moduelRouters)
  } catch (e) {
    console.warn('Load', '../apps/' + moduleName + '/routers.js', 'failed.')
  }
}

// 处理admin 重定向
const handleAdminRedirect = () => {
  let flag = false
  let obj = {}
  let platformAdminIndex = 'platform.admin.Index'
  if (adminChildren) {
    for (let item of adminChildren) {
      if (item.name === platformAdminIndex) {
        flag = true
        break
      }
    }
  }
  if (flag) {
    obj = {
      redirect: {
        name: platformAdminIndex
      }
    }
  }
  return obj
}

// not found
// const notFound = {
//   path: '',
//   name: 'notFound',
//   component: {},
//   meta: {
//     title: 'notFound',
//     requiresAuth: false,
//     notFound: true
//   }
// }

export default [
  // 平台首页
  {
    path: '/',
    name: 'platform.index',
    component: resolve => require(['./pages/Index'], resolve),
    meta: {
      title: '首页',
      requiresAuth: false,
      scrollToTop: true
    },
    children: [
      // 登录
      {
        path: 'signin',
        name: 'platform.signin',
        component: resolve => require(['./pages/SignIn'], resolve),
        meta: {
          title: '登录',
          requiresAuth: false,
          scrollToTop: true
        }
      },
      // 后台首页
      {
        path: 'admin',
        name: 'platform.admin',
        component: resolve => require(['./pages/Admin'], resolve),
        meta: {
          title: '后台',
          requiresAuth: true,
          scrollToTop: true
        },
        children: [
          {
            path: 'Error404',
            name: 'platform.admin.Error404ForAdmin',
            component: resolve => require(['./pages/Error404ForAdmin'], resolve),
            meta: {
              title: 'Error404ForAdmin',
              requiresAuth: false,
              scrollToTop: true
            }
          },
          ...adminChildren
        ],
        ...handleAdminRedirect()
      },
      {
        path: 'Error404',
        name: 'platform.Error404',
        component: resolve => require(['./pages/Error404'], resolve),
        meta: {
          title: 'Error404',
          requiresAuth: false,
          scrollToTop: true
        }
      }
    ]
  }
]
