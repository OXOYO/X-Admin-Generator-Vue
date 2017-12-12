/**
* Created by OXOYO on 2017/12/6.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .layout-content {
    position: absolute;
    z-index: 500;
    top: 101px;
    left: 0;
    right: 0;
    bottom: 0;
    height: auto;
    min-height: 500px;
    margin: 0 20px 20px;
    overflow: hidden;
    background: #fff;
  }
  .layout-content-container-active  {
    position: absolute;
  }
</style>

<template>
  <div>
    <!-- 导航栏 -->
    <NavForAdmin></NavForAdmin>
    <!-- 面包屑 -->
    <BreadcrumbForAdmin></BreadcrumbForAdmin>
    <!-- 子路由 -->
    <div class="layout-content">
      <!-- 加载子组件 -->
      <transition enter-active-class="animated fadeIn layout-content-container-active" leave-active-class="animated fadeOut layout-content-container-active">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  import NavForAdmin from './NavForAdmin.vue'
  import BreadcrumbForAdmin from '../components/BreadcrumbForAdmin.vue'

  export default {
    name: 'MainForAdmin',
    components: {
      NavForAdmin,
      BreadcrumbForAdmin
    }
  }
</script>

