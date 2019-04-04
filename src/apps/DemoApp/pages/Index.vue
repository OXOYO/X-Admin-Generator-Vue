/**
* Created by yangfan9244 on 2017/12/5.
*
* DemoApp 应用根组件
*/

<style scoped lang="less" rel="stylesheet/less">
</style>

<template>
  <div class="main-box">
    <h1>TODO DemoApp</h1>
  </div>
</template>

<script>
  import Store from '../store'

  export default {
    name: 'DemoApp',
    created: function () {
      let _t = this
      // 将store注册到apps下
      _t.$store.registerModule([_t.$utils.store.getModuleName('Apps'), Store.moduleName], Store.store)
    },
    destroyed: function () {
      let _t = this
      // 卸载store
      _t.$store.unregisterModule([_t.$utils.store.getModuleName('Apps'), Store.moduleName])
    }
  }
</script>

