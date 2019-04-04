/**
* Created by yangfan9244 on 2019/4/4.
*
* Home
*/

<style scoped lang="less" rel="stylesheet/less"></style>

<template>
  <!-- 系统首页 -->
  <div class="layout layout-home">
    <HomeNav></HomeNav>
    <HomeContent>
      <router-view></router-view>
    </HomeContent>
  </div>
</template>

<script>
  import HomeNav from '../containers/HomeNav'
  import HomeContent from '../containers/HomeContent'

  export default {
    name: 'Home',
    components: {
      HomeNav,
      HomeContent
    }
  }
</script>
