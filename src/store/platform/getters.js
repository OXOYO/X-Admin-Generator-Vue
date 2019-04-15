/**
 * Created by OXOYO on 2019/4/4.
 *
 *
 */

// 获取当前角色下某个资源对应的权限列表
const getPermission = (userInfo, userResources, resourceName, key = 'name') => {
  if (userInfo.type === 0) {
    return [0, 1, 2]
  }
  let targetResource = userResources.find(item => item[key] === resourceName)
  let currentUserGroup = userInfo.currentUserGroup
  if (targetResource && currentUserGroup) {
    let roleResourceList = currentUserGroup.permission.split(',').map(item => {
      let [id, ...permission] = item.split('|').map(item => parseInt(item))
      return {
        id: id,
        permission
      }
    })
    let target = roleResourceList.find(item => item.id === targetResource.id)
    return target && target.permission ? target.permission : []
  }
  return []
}

export default {
  userInfo: state => state.userInfo,
  userClass: state => state.userClass,
  // TODO 权限验证功能待实现
  verifyPermission: (state) => {
    return (resourceName, code) => {
      if (!resourceName) {
        return false
      }
      if (state.unless.verifyPermission.router.includes(resourceName)) {
        return true
      }
      let userInfo = state.userInfo
      let userResources = state.userResources
      let permissionList = getPermission(userInfo, userResources, resourceName)
      if (permissionList && permissionList.length) {
        return permissionList.includes(code)
      }
      return false
    }
  }
}
