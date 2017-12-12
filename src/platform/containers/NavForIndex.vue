/**
* Created by OXOYO on 2017/12/6.
*
* 前台导航栏
*/

<style scoped lang="less" rel="stylesheet/less">
  .nav-index {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: transparent;
    z-index: 2000;

    .ivu-menu-item {
      color: #fff;
      &:hover {
        color: #000;
      }
    }
    .nav-logo {
      height: 30px;
      line-height: 30px;
      text-align: center;
      /*background: #5b6270;*/
      color: #FFFFFF;
      border-radius: 3px;
      float: left;
      position: relative;
      top: 15px;
      left: 20px;

      a {
        color: #ffffff;

        &:hover {
          color: #cdcdcd;
        }
      }
    }
    .nav-index-menu {
      float: right;
      margin: 0 auto;

      li {
        &:hover {
          color: #cdcdcd !important;
        }
      }
    }
    .layout-assistant {
      width: 300px;
      margin: 0 auto;
      height: inherit;
    }
  }
</style>

<template>
  <Menu class="nav-index" mode="horizontal" theme="dark" @on-select="triggerMenu">
    <div class="nav-logo">
      <router-link :to="{ name: 'platform.index'}">{{ $Config.System.title }}</router-link>
    </div>
    <div class="nav-index-menu">
      <Menu-item name="SignIn">
        <Icon type="log-in"></Icon>
        登录
      </Menu-item>
      <Menu-item name="about">
        <Icon type="ios-keypad"></Icon>
        关于
      </Menu-item>
    </div>
  </Menu>
</template>

<script>
  export default {
    name: 'NavForIndex',
    methods: {
      triggerMenu: function (routerName) {
        let _t = this
        if (routerName === 'SignIn') {
          _t.$router.push({name: 'platform.signin'})
        }
      }
    }
  }
</script>

