/**
* Created by OXOYO on 2017/12/5.
*
* SystemLog 应用根组件
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <div class="main-box" v-if="verifyPermission($route.name, 0)">
    <!-- 查询日志 -->
    <SearchLogs></SearchLogs>
    <!-- 日志详情 -->
    <DetailLog></DetailLog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Store from '../store'
  import SearchLogs from '../containers/SearchLogs.vue'
  import DetailLog from '../containers/DetailLog.vue'

  export default {
    name: 'SystemLog',
    components: {
      SearchLogs,
      DetailLog
    },
    computed: {
      ...mapGetters('Platform', [
        'verifyPermission'
      ])
    },
    created: function () {
      let _t = this
      // 将store注册到apps下
      _t.$store.registerModule(['Apps', Store.moduleName], Store.store)
    },
    destroyed: function () {
      let _t = this
      // 卸载store
      _t.$store.unregisterModule(['Apps', Store.moduleName])
    }
  }
</script>
