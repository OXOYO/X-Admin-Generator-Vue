/**
* Created by yangfan9244 on 2019/4/4.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .copy-right {
    position: absolute;
    z-index: 200;
    bottom: 40px;
    width: 100%;
    text-align: center;
    padding: 10px 0 20px;
    color: #ffffff;
  }
</style>

<template>
  <div class="copy-right">
    {{ $config.system.copyright }}
    Version {{ $config.system.version }}
  </div>
</template>

<script>
  export default {
    name: 'Copyright'
  }
</script>

