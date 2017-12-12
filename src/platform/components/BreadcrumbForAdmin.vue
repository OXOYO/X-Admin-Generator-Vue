/**
* Created by OXOYO on 2017/8/8.
*
* 面包屑 组件
*/

<style scoped lang="less" rel="stylesheet/less">
  .layout-breadcrumb {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    z-index: 500;
    padding: 10px 15px;
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
  import utils from '@/global/utils'
  const moduleName = utils.store.getModuleName('Platform')

  export default {
    name: 'BreadcrumbForAdmin',
    computed: mapState(moduleName, {
      menuList: state => state.layout.menus.list,
      activeName: state => state.layout.menus.activeName,
      breadcrumbList: function () {
        let _t = this
        let breadcrumbList = _t.handleBreadcrumbList(_t.activeName)
        return breadcrumbList
      }
    }),
    methods: {
      handleBreadcrumbList: function (activeMenu) {
        let _t = this
        let breadcrumbList = [
          {
            name: 'platform.admin',
            path: '',
            title: '首页',
            icon: 'home'
          }
        ]
        // 递归调用，处理面包屑
        let pushBreadCrumbItem = function (activeMenu, menuList, isEq = false) {
          for (let i = 0, len = menuList.length, menuItem; i < len; i++) {
            menuItem = menuList[i]
            if (isEq ? activeMenu === menuItem.name : activeMenu.includes(menuItem.name)) {
              breadcrumbList.push({
                name: menuItem.name,
                path: '',
                title: menuItem.title,
                icon: menuItem.icon
              })
              if (menuItem.children && menuItem.children.length) {
                let childrenMenuList = menuItem.children
                pushBreadCrumbItem(activeMenu, childrenMenuList, true)
              } else {
                break
              }
            }
          }
        }
        pushBreadCrumbItem(activeMenu, _t.menuList)
        return breadcrumbList
      }
    }
  }
</script>

