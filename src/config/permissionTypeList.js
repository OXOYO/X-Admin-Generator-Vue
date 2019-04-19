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
    lang: 'L00114',
    resourceType: ['module-system', 'module-app'],
    enable: true
  },
  {
    key: 1,
    label: '写',
    lang: 'L00115',
    resourceType: ['module-system', 'module-app'],
    enable: true
  },
  {
    key: 2,
    label: '访问',
    lang: 'L00116',
    resourceType: ['module-link'],
    enable: true
  }
]
