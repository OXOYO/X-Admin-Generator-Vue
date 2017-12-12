/**
* Created by OXOYO on 2017/8/8.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .layout-copy {
    position: absolute;
    z-index: 200;
    bottom: 40px;
    width: 100%;
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
</style>

<template>
  <div class="layout-copy">
    {{ $Config.System.copyright }}
  </div>
</template>

<script>
  export default {
    name: 'Copyright'
  }
</script>

