/**
* Created by yangfan9244 on 2019/4/23.
*
* MainContent
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-content-box {
    width: 100%;
    min-height: 500px;
    padding: 10px;
  }
</style>

<template>
  <div class="main-content-box">
    TODO MainContent {{ currentActiveName }}
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'MainContent',
    computed: {
      ...mapState('Apps/Settings', {
        currentActiveName: state => state.currentActiveName
      })
    }
  }
</script>
