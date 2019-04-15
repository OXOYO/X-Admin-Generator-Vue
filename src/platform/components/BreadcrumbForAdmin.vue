/**
* Created by OXOYO on 2017/8/8.
*
* 面包屑 组件
*/

<style scoped lang="less" rel="stylesheet/less">
  .layout-breadcrumb {
    display: inline-block;
    vertical-align: middle;
  }
</style>

<template>
  <div class="layout-breadcrumb">
    <Breadcrumb v-if="breadcrumbList && breadcrumbList.length">
      <Breadcrumb-item v-for="item in breadcrumbList" :key="item.name" :href="item.path">
        <Icon v-if="item.icon" :type="item.icon"></Icon>
        <router-link :to="{ name: item.name }">{{ item.title }}</router-link>
      </Breadcrumb-item>
    </Breadcrumb>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'BreadcrumbForAdmin',
    computed: mapState('Platform', {
      resourceMap: state => state.admin.resourceMap,
      activeMenuName: state => state.admin.activeMenuName,
      breadcrumbList: function () {
        let _t = this
        let breadcrumbList = _t.handleBreadcrumbList(_t.activeMenuName)
        return breadcrumbList
      }
    }),
    methods: {
      handleBreadcrumbList: function (activeMenuName) {
        let _t = this
        let breadcrumbList = []
        // 递归调用，处理面包屑
        let pushBreadCrumbItem = function (activeMenuName, menuList, isEq = false) {
          for (let i = 0, len = menuList.length, menuItem; i < len; i++) {
            menuItem = menuList[i]
            if (isEq ? activeMenuName === menuItem.name : activeMenuName.includes(menuItem.name)) {
              breadcrumbList.push({
                name: menuItem.name,
                path: '',
                title: menuItem.title,
                icon: menuItem.icon
              })
              // 查找父节点
              if (menuItem.parent_id !== 0) {
                let parentNode = menuList.filter(item => item.id === menuItem.parent_id)[0]
                if (parentNode) {
                  pushBreadCrumbItem(parentNode.name, menuList, true)
                } else {
                  break
                }
              } else {
                break
              }
            }
          }
        }
        pushBreadCrumbItem(activeMenuName, _t.resourceMap['admin-sidebar'], true)
        // 判断是否有后台首页
        let hasAdminIndex = breadcrumbList.find(item => item.name === 'platform.admin.AdminIndex')
        if (!hasAdminIndex) {
          breadcrumbList.push({
            name: 'platform.admin.AdminIndex',
            path: '',
            title: '首页',
            icon: 'home'
          })
        }
        // 反转
        return breadcrumbList.reverse()
      }
    }
  }
</script>
