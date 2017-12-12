/**
* Created by OXOYO on 2017/8/17.
*
* 面板 组件
*/

<style scoped lang="less" rel="stylesheet/less">
  .u-panel {
    display: inline-block;
    width: 100%;

    .u-panel-header {
      height: 38px;
      line-height: 38px;
      padding-left: 32px;
      color: #666;
      width: 100%;
      background: #f5f7f9;

      .u-panel-title {

      }
    }
    .u-panel-body {
      display: inline-block;
      width: 100%;
      background: #ffffff;
      padding: 16px;
    }
  }
</style>

<template>
  <div class="u-panel" :name="name">
    <div class="u-panel-header" @click="handleToggle">
      <slot name="header">
        <div class="u-panel-title">{{ title }}</div>
      </slot>
    </div>
    <div class="u-panel-body" :class="{'u-panel-fold': isFolded}">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'UPanel',
    props: {
      title: {
        type: String
      },
      name: {
        type: String
      }
    },
    data () {
      return {
        // 是否已折叠
        isFolded: false
      }
    },
    methods: {
      handleToggle: function () {
        let _t = this
        // 处理面板折叠
        _t.isFolded = !_t.isFolded
      }
    }
  }
</script>

