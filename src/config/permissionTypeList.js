/**
 * Created by OXOYO on 2019/4/15.
 *
 *
 */

// 权限类型列表
export default [
  {
    key: 0,
    label: '读',
    resourceType: ['module-system', 'module-app'],
    enable: true
  },
  {
    key: 1,
    label: '写',
    resourceType: ['module-system', 'module-app'],
    enable: true
  },
  {
    key: 2,
    label: '访问',
    resourceType: ['module-link'],
    enable: true
  }
]
