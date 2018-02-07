/**
* Created by OXOYO on 2017/12/6.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .layout-logo-left {
    width: 90%;
    height: 30px;
    line-height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
    color: #fff;
    text-align: center;
    overflow: hidden;

    a {
      color: #fff;
    }
  }
  .ivu-icon {
    vertical-align: middle;
  }
  .layout-text {
    vertical-align: middle;
  }
  .ivu-menu-dark {
    background: #464c5b;
  }
</style>

<template>
  <Menu :active-name="activeMenuName" theme="dark" width="auto" @on-select="triggerMenu">
    <div class="layout-logo-left">
      <router-link :to="{ name: 'platform.admin'}">{{ $Config.System.title }}</router-link>
    </div>
    <components
      v-for="item in menuList"
      :is="item.children && item.children.length ? 'Submenu' : 'MenuItem'"
      :key="item.name"
      :name="item.name"
    >
      <!-- 有子节点 -->
      <template
        v-if="item.children && item.children.length"
        slot="title"
      >
        <Icon class="layout-icon" :type="item.icon" :size="iconSize"></Icon>
        <span class="layout-text">{{ item.title }}</span>
      </template>
      <MenuItem
        v-if="item.children && item.children.length"
        v-for="childItem in item.children"
        :key="childItem.name"
        :name="childItem.name"
      >
        <Icon class="layout-icon" :type="childItem.icon" :size="iconSize"></Icon>
        <span class="layout-text">{{ childItem.title }}</span>
      </MenuItem>
      <!-- 无子节点 -->
      <Icon v-if="!(item.children && item.children.length)" class="layout-icon" :type="item.icon" :size="iconSize"></Icon>
      <span v-if="!(item.children && item.children.length)" class="layout-text">{{ item.title }}</span>
    </components>
  </Menu>
</template>

<script>
  import { mapState } from 'vuex'
  import utils from '@/global/utils'
  const moduleName = utils.store.getModuleName('Platform')

  export default {
    name: 'SidebarForAdmin',
    data () {
      return {
        menuList: [],
        activeMenuName: ''
      }
    },
    computed: {
      iconSize () {
        return this.spanLeft === 1 ? 20 : 24
      },
      ...mapState(moduleName, {
        spanLeft: function (state) {
          let spanLeft = state.layout.spanSize.left
          if (spanLeft === 0) {
            spanLeft = 3
          }
          return spanLeft
        },
        userInfo: state => state.userInfo,
        menuInfo: state => state.layout.menus
      })
    },
    watch: {
      userInfo: {
        handler: function (val) {
          let _t = this
          _t.getMenuList(val)
        },
        deep: true
      }
    },
    methods: {
      triggerMenu: function (routerName) {
        let _t = this
        // 点击菜单跳转路由
        _t.$router.push({
          name: routerName
        })
      },
      getMenuList: function (val) {
        let _t = this
        let userInfo = val
        let menuList = _t.menuInfo.list
        let tmpArr = []
        // 没有用户信息则返回全部菜单
        if (userInfo) {
          // 根据权限码显示菜单
          let handler = function (list) {
            return list.filter(item => {
              // 判断当前节点是否启用、是否放置在sidebar、是否允许当前用户类别
              if (item.enable && item.sidebar && item.userType.includes(userInfo.type)) {
                // 处理子节点
                if (item.children && item.children.length) {
                  item.children = handler(item.children)
                }
                return true
              } else {
                return false
              }
            })
          }
          tmpArr = handler(menuList)
        } else {
          tmpArr = menuList
        }
        _t.menuList = tmpArr
        _t.$nextTick(() => {
          _t.activeMenuName = _t.menuInfo.activeName
        })
      }
    }
  }
</script>
