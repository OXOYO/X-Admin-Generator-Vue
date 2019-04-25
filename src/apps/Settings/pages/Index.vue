/**
* Created by OXOYO on 2017/12/5.
*
* Settings 应用根组件
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-box {
    display: flex;
    margin: 0;

    .sidebar {
      flex: 0 0 auto;
    }
    .main-content {
      flex: 1 1 auto;
    }
  }
</style>

<template>
  <div class="main-box">
    <Sidebar class="sidebar"></Sidebar>
    <MainContent class="main-content"></MainContent>
  </div>
</template>

<script>
  import Store from '../store'

  import Sidebar from '../containers/Sidebar'
  import MainContent from '../containers/MainContent'

  export default {
    name: 'Settings',
    components: {
      Sidebar,
      MainContent
    },
    created () {
      let _t = this
      // 将store注册到apps下
      _t.$store.registerModule(['Apps', Store.moduleName], Store.store)
    },
    destroyed () {
      let _t = this
      // 卸载store
      _t.$store.unregisterModule(['Apps', Store.moduleName])
    }
  }
</script>
