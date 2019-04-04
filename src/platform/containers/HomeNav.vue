/**
* Created by yangfan9244 on 2017/12/6.
*
* 前台导航栏
*/

<style scoped lang="less" rel="stylesheet/less">
  .home-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: transparent;
    z-index: 2000;

    &:hover {
      background: #386ed3;
    }

    .ivu-menu-item {
      &:hover {
        color: #000;
      }
    }
    .nav-logo {
      height: 30px;
      line-height: 30px;
      text-align: center;
      /*background: #5b6270;*/
      border-radius: 3px;
      float: left;
      position: relative;
      top: 15px;
      left: 20px;

      a {
        &:hover {
          color: #ff8300;
        }
      }
    }
    .home-nav-menu {
      float: right;
      margin: 0 auto;

      li {
        &:hover {
          color: #fff !important;
          background: #184fb6;
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
  <div class="home-nav">
    <Menu class="nav" mode="horizontal" theme="light" @on-select="triggerMenu">
      <div class="nav-logo">
        <router-link :to="{ name: 'platform.home'}">{{ $config.system.title }}</router-link>
      </div>
      <div class="home-nav-menu">
        <Menu-item name="SignIn">
          <Icon type="log-in"></Icon>
          登录
        </Menu-item>
        <Menu-item name="About">
          <Icon type="ios-keypad"></Icon>
          关于
        </Menu-item>
      </div>
    </Menu>
  </div>
</template>

<script>
  export default {
    name: 'HomeNav',
    methods: {
      triggerMenu: function (routerName) {
        let _t = this
        if (routerName === 'SignIn') {
          _t.$router.push({name: 'platform.home.signin'})
        } else if (routerName === 'About') {
          _t.$router.push({name: 'platform.home.about'})
        }
      }
    }
  }
</script>
