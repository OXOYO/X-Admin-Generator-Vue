/**
* Created by OXOYO on 2017/12/6.
*
* 后台导航栏
*/

<style scoped lang="less" rel="stylesheet/less">
  .nav-admin {
    position: absolute;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    height: 60px;
    line-height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);

    .nav-admin-menu {
      display: inline-block;
      vertical-align: middle;
      float: right;
      background: transparent;

      .menu-block-right {
        float: right;
        margin: 0 auto;

        li {
          &:hover {
            color: #cdcdcd !important;
          }
        }
      }

      .ivu-menu-item {
        &:hover,
        &.ivu-menu-item-active {
          color: #000;
        }
      }
    }
  }
</style>

<template>
  <div class="nav-admin">
    <Button type="text" @click="toggleSidebar">
      <Icon type="navicon" size="32"></Icon>
    </Button>
    <Menu class="nav-admin-menu" mode="horizontal" theme="light" active-name="null" @on-select="triggerMenu">
      <div class="menu-block-right">
        <Submenu name="userInfo">
          <template slot="title">
            <Icon :type="userInfo.type === '1' ? 'ios-person-outline' : 'ios-person'"></Icon>
            {{ userInfo.account || userInfo.name }}
          </template>
          <Menu-item name="SignOut">退出</Menu-item>
        </Submenu>
        <Menu-item name="about">
          <Icon type="ios-keypad"></Icon>
          关于
        </Menu-item>
      </div>
    </Menu>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import utils from '@/global/utils'
  const moduleName = utils.store.getModuleName('Platform')

  export default {
    name: 'NavForAdmin',
    computed: {
      ...mapState(moduleName, {
        spanSize: state => state.layout.spanSize,
        breadcrumb: state => state.layout.breadcrumb,
        userInfo: state => state.userInfo
      })
    },
    methods: {
      toggleSidebar: function () {
        let _t = this
        let spanSize = null
        switch (_t.spanSize.right) {
          case 24:
            spanSize = {
              left: 1,
              right: 23
            }
            break
          case 21:
            spanSize = {
              left: 1,
              right: 23
            }
            break
          default:
            spanSize = {
              left: 3,
              right: 21
            }
        }
        // 分发action 执行状态更新
        _t.$store.commit(_t.$utils.store.getType('layout/spanSize/update', 'Platform'), spanSize)
      },
      triggerMenu: function (routerName) {
        let _t = this
        if (routerName === 'SignOut') {
          // 清除用户状态
          _t.$Message.success('退出成功！')
          // 清空cookie
          Object.keys(_t.$Cookies.get()).forEach(function (cookie) {
            _t.$Cookies.remove(cookie)
          })
          _t.$store.commit(_t.$utils.store.getType('userInfo/reset', 'Platform'), {})
          // 点击菜单跳转路由
          _t.$router.push({
            name: 'platform.index'
          })
        }
      }
    }
  }
</script>

