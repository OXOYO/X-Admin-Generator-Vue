/**
* Created by OXOYO on 2017/12/5.
*
* Roles 应用根组件
*/

<style scoped lang="less" rel="stylesheet/less">
</style>

<template>
  <div class="main-box">
    <h1>TODO Roles</h1>
  </div>
</template>

<script>
  import Store from '../store'

  export default {
    name: 'Roles',
    created () {
      let _t = this
      // 将store注册到apps下
      _t.$store.registerModule(['apps', Store.moduleName], Store.store)
    },
    destroyed () {
      let _t = this
      // 卸载store
      _t.$store.unregisterModule(['apps', Store.moduleName])
    }
  }
</script>
