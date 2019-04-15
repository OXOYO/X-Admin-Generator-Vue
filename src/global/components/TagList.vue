/**
* Created by OXOYO on 2017/5/26.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .tag-list {
    display: inline-block;

    .tag-item {
      display: inline-block;
    }
  }
</style>

<template>
  <div class="tag-list">
    <Tag v-for="(item, index) in list"
         class="tag-item"
         :closable="item.closable"
         :type="item.type"
         :color="item.color"
         :name="item.name"
         :key="index"
         @on-close="(event, name) => handleClose(name, item)"
    >
      <span :title="item.title ? item.title : ''">{{ item.content }}</span>
    </Tag>
  </div>
</template>

<script>
  export default {
    name: 'TagList',
    props: {
      list: {
        type: Array,
        require: true
      }
    },
    methods: {
      handleClose: function (name, item) {
        if (item.onClose instanceof Function) {
          item.onClose(name, item)
        }
      }
    }
  }
</script>
