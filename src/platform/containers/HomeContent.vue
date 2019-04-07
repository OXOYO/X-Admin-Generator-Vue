/**
* Created by OXOYO on 2019/4/4.
*
* 前台内容区
*/

<style scoped lang="less" rel="stylesheet/less">
  .home-content {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>

<template>
  <div class="home-content">
    <!-- 壁纸 -->
    <!--<Wallpaper switchType="bing"></Wallpaper>-->
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'HomeContent'
  }
</script>
