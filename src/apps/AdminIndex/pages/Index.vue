/**
* Created by OXOYO on 2017/12/5.
*
* AdminIndex 应用根组件
*/

<style scoped lang="less" rel="stylesheet/less">
</style>

<template>
  <div class="main-box">
    <h1>TODO AdminIndex</h1>
  </div>
</template>

<script>
  import Store from '../store'

  export default {
    name: 'AdminIndex',
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

