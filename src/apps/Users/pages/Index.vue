/**
* Created by OXOYO on 2017/12/5.
*
* 用户管理模块 根组件
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <div class="main-box">
    <XPanel>
      <div slot="header-right" class="panel-header">
        <div class="action-btn" @click.stop="handleAction('add')">
          <Tooltip placement="top" :content="$t('L00122')">
            <Icon class="action-icon" type="md-add"></Icon>
          </Tooltip>
        </div>
        <div class="action-btn" @click.stop="handleAction('refresh')">
          <Tooltip placement="top" :content="$t('L00121')">
            <Icon class="action-icon" type="md-refresh"></Icon>
          </Tooltip>
        </div>
      </div>
      <div slot="body" class="panel-body">
        <SearchUsers></SearchUsers>
      </div>
    </XPanel>
    <!-- 新增/编辑弹窗 -->
    <EditUser></EditUser>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Store from '../store'
  import EditUser from '../containers/EditUser.vue'
  import SearchUsers from '../containers/SearchUsers.vue'

  export default {
    name: 'Users',
    components: {
      EditUser,
      SearchUsers
    },
    computed: {
      ...mapGetters('Platform', [
        'verifyPermission'
      ])
    },
    methods: {
      // 处理操作
      handleAction: function (action) {
        let _t = this
        switch (action) {
          case 'add':
            // 广播事件
            _t.$X.utils.bus.$emit('Apps/Users/edit', {
              action: 'add',
              info: {}
            })
            break
          case 'refresh':
            // 刷新列表
            _t.$X.utils.bus.$emit('Apps/Users/list/refresh')
            break
        }
      }
    },
    created: function () {
      let _t = this
      // 将store注册到apps下
      _t.$store.registerModule(['Apps', Store.moduleName], Store.store)
      _t.$X.utils.bus.$on('Apps/Users/list/init/start', function () {
        _t.$nextTick(function () {
          // 初始化列表
          _t.$X.utils.bus.$emit('Apps/Users/list/init')
        })
      })
      _t.$nextTick(function () {
        // 初始化列表
        _t.$X.utils.bus.$emit('Apps/Users/list/init')
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/Users/list/init/start')
    },
    destroyed: function () {
      let _t = this
      // 卸载store
      _t.$store.unregisterModule(['Apps', Store.moduleName])
    }
  }
</script>
