/**
* Created by OXOYO on 2017/12/5.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  body {
    overflow: hidden;
  }
  .layout {
    background: #f5f7f9;
    height: 100%;
    width: 100%;
    border: none;
  }
  .layout-breadcrumb {
    padding: 10px 15px 0;
  }
  .layout-content {
    position: relative;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    margin: 0;
    min-height: 200px;
    overflow: hidden;
    background: #fff;
    /*border-radius: 4px;*/

    .layout-video {
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .layout-shade {
      position: absolute;
      z-index: 1000;
      height: 100%;
      width: 100%;
      background: rgba(0, 0, 0, .1);
    }
  }
  .layout-content-main {
    padding: 10px;
  }
  .particles-background {
    background: #383838;
    height: 100%;
    width: 100%;
  }
</style>

<template>
  <!-- 系统首页 -->
  <div class="layout">
    <!-- 后台首页 -->
    <template v-if="$route.name.includes('platform.admin')">
      <!-- 子路由 -->
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <router-view></router-view>
      </transition>
    </template>
    <!-- 前台首页 -->
    <template v-else>
      <NavForIndex></NavForIndex>
      <div class="layout-content">
        <!-- 壁纸 -->
        <Wallpaper></Wallpaper>
        <!-- 子路由 -->
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <router-view></router-view>
        </transition>
      </div>
      <!-- 版权信息 -->
      <Copyright></Copyright>
    </template>
  </div>
</template>

<script>
  import NavForIndex from '../containers/NavForIndex.vue'

  export default {
    name: 'PlatformIndex',
    components: {
      NavForIndex
    }
  }
</script>

